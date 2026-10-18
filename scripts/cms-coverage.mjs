#!/usr/bin/env node
/**
 * CMS coverage map for the ITFYG redesign.
 *
 * For every public route, traces each rendered section back to the reader that
 * supplies it, the seed that backs it, the type that describes it, the admin
 * editor that edits it, the Firestore collection it lands in, and the
 * revalidation entry that publishes it.
 *
 * The verdict that matters is "partial": some fields editable and others
 * hardcoded. That state is invisible from the admin side, which is exactly why
 * it needs to be listed rather than discovered later.
 *
 * Usage: node scripts/cms-coverage.mjs [--json|--markdown]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";

const ROOT = process.cwd();
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");

/* ------------------------------------------------------------ public routes */

const GROUP = /^\(.+\)$/;
function walkPages(dir, segments = [], out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkPages(full, GROUP.test(entry) ? segments : [...segments, entry], out);
    } else if (entry === "page.tsx") {
      out.push({ file: relative(ROOT, full), route: "/" + segments.join("/") });
    }
  }
  return out;
}
const publicPages = walkPages(join(ROOT, "app", "(public)"))
  .map((p) => ({ ...p, route: p.route === "/" ? "/" : p.route.replace(/\/$/, "") }))
  .sort((a, b) => a.route.localeCompare(b.route));

/* --------------------------------------------------- reader -> seed/collection */

const cmsFiles = readdirSync(join(ROOT, "lib", "cms"))
  .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
  .map((f) => ({ file: `lib/cms/${f}`, text: read(`lib/cms/${f}`) }));

/** Every getCms* reader, with the collection and seed it uses. */
const readers = new Map();
for (const { file, text } of cmsFiles) {
  for (const m of text.matchAll(/export async function (getCms\w+)\s*\(([\s\S]*?)\n}/g)) {
    const [, name, body] = m;
    const collection = body.match(/FIREBASE_COLLECTIONS\.(\w+)/)?.[1] ?? null;
    const seeds = [...body.matchAll(/\bseed([A-Z]\w+)/g)].map((s) => `seed${s[1]}`);
    /* Submitted data, not editorial content: there is nothing to seed and an
       empty result is the correct answer, so absence of a fallback is not a
       finding here. */
    const OPERATIONAL = ["applications", "contactMessages", "newsletterSubs", "users", "auditLog"];
    readers.set(name, {
      name,
      file,
      collection,
      seed: [...new Set(seeds)][0] ?? null,
      // A reader with no fallback returns empty when Firestore is empty.
      hasFallback: seeds.length > 0,
      operational: OPERATIONAL.includes(collection ?? ""),
    });
  }
}

/* ------------------------------------------------------------ admin registry */

const registrySrc = read("lib/content/admin-registry.ts");
const adminNodes = [...registrySrc.matchAll(
  /\{\s*key:\s*"([^"]+)"[^}]*?adminPath:\s*"([^"]+)"(?:[^}]*?previewHref:\s*"([^"]+)")?[^}]*?\}/g,
)].map((m) => ({ key: m[1], adminPath: m[2], previewHref: m[3] ?? null }));

/* A previewHref is a concrete path such as /what-we-do/girls-in-tech, while the
   route is /what-we-do/[slug]. Exact-string matching reported an editor as
   missing for every dynamic route, so match by segment pattern instead. */
function routeMatches(route, path) {
  if (route === path) return true;
  const r = route.split("/").filter(Boolean);
  const p = path.split("/").filter(Boolean);
  if (r.length !== p.length) return false;
  return r.every((seg, i) => seg.startsWith("[") || seg === p[i]);
}

function editorsFor(route) {
  const hits = adminNodes
    .filter((n) => n.previewHref && routeMatches(route, n.previewHref))
    .map((n) => n.adminPath);
  return [...new Set(hits)];
}

/* -------------------------------------------------------------- revalidation */

const revalidateSrc = read("lib/utils/revalidate.ts");

/* Static entries in revalidationMap. */
const revalidatedPaths = new Set(
  [...revalidateSrc.matchAll(/"(\/[^"]*)"/g)].map((m) => m[1]),
);

/* getRevalidationPaths also appends slug paths at runtime, e.g.
   paths.add(`/what-we-do/${slug}`). Reading only the static map reported every
   dynamic route as unrevalidated, which was a false-positive class of its own.
   Those templates are collected here and treated as covering the matching
   dynamic route. */
for (const m of revalidateSrc.matchAll(/paths\.add\(`([^`]+)`\)/g)) {
  revalidatedPaths.add(m[1].replace(/\$\{slug\}/g, "[slug]"));
}

/* Rendered on demand from the live course API, so there is no cached page to
   revalidate. Recorded as a deliberate exception rather than a gap. */
const DYNAMIC_BY_DESIGN = new Set([
  "/programs",
  "/programs/[category]",
  "/programs/[category]/[courseId]",
  "/programs/course/[courseSlug]",
  "/apply-for-training/courses/[slug]",
]);

/* ------------------------------------------ component tree -> readers per page */

/** Resolve a @/ import to a file on disk. */
function resolveImport(spec) {
  if (!spec.startsWith("@/")) return null;
  const base = spec.replace("@/", "");
  for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
    if (existsSync(join(ROOT, base + ext))) return base + ext;
  }
  return null;
}

/** Collect every getCms* reader reachable from a page, following @/ imports. */
function readersFor(pageFile, depth = 3, seen = new Set()) {
  if (depth === 0 || seen.has(pageFile)) return new Set();
  seen.add(pageFile);
  const text = read(pageFile);
  const found = new Set([...text.matchAll(/\b(getCms\w+)\s*\(/g)].map((m) => m[1]));
  for (const m of text.matchAll(/from\s+"(@\/[^"]+)"/g)) {
    const target = resolveImport(m[1]);
    if (!target) continue;
    /* Only follow into components. Following lib/cms/* would pull in every
       reader that file defines rather than the ones this page calls, which
       made the map claim pages used readers they never touch. */
    if (!/^components\//.test(target)) continue;
    for (const r of readersFor(target, depth - 1, seen)) found.add(r);
  }
  return found;
}

/** Section-level components a page renders, as a proxy for "sections". */
function sectionsFor(pageFile) {
  const text = read(pageFile);
  return [...new Set(
    [...text.matchAll(/<([A-Z]\w+)/g)].map((m) => m[1]),
  )].filter((c) => !["Metadata", "Suspense", "Fragment", "Image", "Link"].includes(c));
}

/* -------------------------------------------------------------------- verdict */

const SCAFFOLD_MARKERS = ["buildHubPage", "Next.js foundation", "connected routes", "rebuild"];

const rows = publicPages.map((p) => {
  const used = [...readersFor(p.file)].sort();
  const resolved = used.map((r) => readers.get(r)).filter(Boolean);
  const collections = [...new Set(resolved.map((r) => r.collection).filter(Boolean))];
  const noFallback = resolved.filter((r) => !r.hasFallback && !r.operational).map((r) => r.name);
  const admin = editorsFor(p.route);
  const pageText = read(p.file);
  const scaffold = SCAFFOLD_MARKERS.some((m) => pageText.includes(m));

  let verdict;
  if (used.length === 0) verdict = "none";
  else if (admin.length === 0 || scaffold) verdict = "partial";
  else verdict = "full";

  return {
    route: p.route,
    file: p.file,
    sections: sectionsFor(p.file),
    readers: used,
    collections,
    readersWithoutFallback: noFallback,
    adminEditors: admin,
    revalidated:
      DYNAMIC_BY_DESIGN.has(p.route) ||
      [...revalidatedPaths].some((path) => routeMatches(p.route, path)),
    dynamicByDesign: DYNAMIC_BY_DESIGN.has(p.route),
    scaffold,
    verdict,
  };
});

/* -------------------------------------------------------------------- output */

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ rows, readers: [...readers.values()] }, null, 2));
} else if (process.argv.includes("--markdown")) {
  console.log("| Route | Readers | Collections | Admin editor | Revalidated | Coverage |");
  console.log("| --- | --- | --- | --- | --- | --- |");
  for (const r of rows) {
    console.log(
      `| \`${r.route}\` | ${r.readers.length ? r.readers.join("<br>") : "_none_"} | ${
        r.collections.join(", ") || "_none_"
      } | ${r.adminEditors.join("<br>") || "**missing**"} | ${
        r.revalidated ? "yes" : "**no**"
      } | ${r.verdict} |`,
    );
  }
} else {
  const count = (v) => rows.filter((r) => r.verdict === v).length;
  console.log("\nCMS COVERAGE MAP\n");
  console.log(`  public routes        ${rows.length}`);
  console.log(`  full coverage        ${count("full")}`);
  console.log(`  partial coverage     ${count("partial")}`);
  console.log(`  no coverage          ${count("none")}`);
  console.log(`  readers discovered   ${readers.size}`);
  console.log(`  readers w/o fallback ${[...readers.values()].filter((r) => !r.hasFallback && !r.operational).length}`);

  console.log("\n  ROUTES WITH NO CMS READER AT ALL");
  for (const r of rows.filter((x) => x.verdict === "none")) {
    console.log(`    ${r.route.padEnd(44)} ${r.file}`);
  }

  console.log("\n  ROUTES WITH READERS BUT NO ADMIN EDITOR");
  for (const r of rows.filter((x) => x.readers.length && !x.adminEditors.length)) {
    console.log(`    ${r.route.padEnd(44)} ${r.readers.slice(0, 3).join(", ")}`);
  }

  console.log("\n  ROUTES NOT IN THE REVALIDATION MAP");
  const unrev = rows.filter((x) => !x.revalidated);
  if (!unrev.length) console.log("    none");
  for (const r of unrev) console.log(`    ${r.route}`);

  console.log("\n  RENDERED ON DEMAND BY DESIGN (no cached page to revalidate)");
  for (const r of rows.filter((x) => x.dynamicByDesign)) console.log(`    ${r.route}`);

  const nf = [...readers.values()].filter((r) => !r.hasFallback && !r.operational);
  if (nf.length) {
    console.log("\n  READERS WITH NO SEED FALLBACK (render empty if Firestore is empty)");
    for (const r of nf) console.log(`    ${r.name.padEnd(34)} ${r.file}`);
  }
  console.log("");
}
