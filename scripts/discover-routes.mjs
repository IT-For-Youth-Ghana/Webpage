#!/usr/bin/env node
/**
 * Route discovery for the ITFYG redesign.
 *
 * Routes are discovered from the filesystem, never from memory or from the
 * navigation menu, because routes drift out of the nav and orphaned pages are
 * common. Dynamic segments are expanded against the seed data that
 * generateStaticParams reads, so one [slug] file is reported as the eight
 * initiative pages it actually produces.
 *
 * The list is then reconciled against three other sources: the navigation
 * config, the sitemap, and internal links in the seed content. Anything present
 * in one source and absent from another is a finding, not noise.
 *
 * Usage: node scripts/discover-routes.mjs [--json]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const APP = join(ROOT, "app");

/* ------------------------------------------------------ filesystem routes */

const GROUP = /^\(.+\)$/;

function walk(dir, segments = [], out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      // Route groups such as (public) organise files without adding a segment.
      walk(full, GROUP.test(entry) ? segments : [...segments, entry], out);
    } else if (entry === "page.tsx" || entry === "route.ts") {
      out.push({
        file: relative(ROOT, full),
        route: "/" + segments.join("/"),
        kind: entry === "route.ts" ? "api" : "page",
        group:
          relative(APP, full).split("/").find((s) => GROUP.test(s)) ?? "(root)",
      });
    } else if (["layout.tsx", "loading.tsx", "error.tsx", "not-found.tsx"].includes(entry)) {
      out.push({
        file: relative(ROOT, full),
        route: "/" + segments.join("/"),
        kind: entry.replace(".tsx", ""),
        group:
          relative(APP, full).split("/").find((s) => GROUP.test(s)) ?? "(root)",
      });
    }
  }
  return out;
}

const all = walk(APP).map((r) => ({ ...r, route: r.route === "/" ? "/" : r.route.replace(/\/$/, "") }));

const pages = all.filter((r) => r.kind === "page");
const apis = all.filter((r) => r.kind === "api");
const chrome = all.filter((r) => ["layout", "loading", "error", "not-found"].includes(r.kind));

const isAdmin = (r) => r.group === "(admin)" || r.route.startsWith("/admin");
const isAuth = (r) => r.group === "(auth)";
const publicPages = pages.filter((r) => !isAdmin(r) && !isAuth(r));
const adminPages = pages.filter(isAdmin);
const authPages = pages.filter(isAuth);

/* --------------------------------------- dynamic segment expansion via seed */

const src = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");
const siteConfig = src("lib/content/site-config.ts");
const trainingConfig = src("lib/content/training-config.ts");
const partnershipConfig = src("lib/content/partnership-config.ts");
const organisationConfig = src("lib/content/organisation-config.ts");
const impactConfig = src("lib/content/impact-config.ts");
const newsConfig = src("lib/content/news-config.ts");

/** The block of source belonging to one exported array, without bleeding into the next. */
function exportBlock(source, exportName) {
  const start = source.indexOf(`export const ${exportName}`);
  if (start === -1) return "";
  const next = source.indexOf("\nexport const ", start + 1);
  return source.slice(start, next === -1 ? undefined : next);
}

/**
 * Slugs paired with the category recorded beside them.
 *
 * Article URLs are /news-and-updates/<category>/<slug>, and the category is per
 * article. Hardcoding "news/" onto every slug put the four blog articles at
 * /news-and-updates/news/... in this report, two URLs that 404, in the document
 * whose job is to say which URLs exist.
 */
export function categorisedSlugsIn(source, exportName) {
  const block = exportBlock(source, exportName);
  const out = [];
  for (const match of block.matchAll(/^\s{2,}slug: "([^"]+)"/gm)) {
    const after = block.slice(match.index, match.index + 400);
    const category = after.match(/^\s{2,}category: "([^"]+)"/m);
    out.push({ slug: match[1], category: category ? category[1] : null });
  }
  return out;
}

/** Slugs declared in an exported array of objects, e.g. `slug: "girls-in-tech"`. */
export function slugsIn(source, exportName) {
  const start = source.indexOf(`export const ${exportName}`);
  if (start === -1) return [];
  // Stop at the next top-level export so we do not bleed into the next array.
  const next = source.indexOf("\nexport const ", start + 1);
  const block = source.slice(start, next === -1 ? undefined : next);
  return [...block.matchAll(/^\s{2,}slug: "([^"]+)"/gm)].map((m) => m[1]);
}

const EXPANSIONS = {
  "/what-we-do/[slug]": slugsIn(siteConfig, "initiatives"),
  /* partnershipPages does not exist in site-config; the pages come from
     partnershipTracks in partnership-config, and reading the wrong array
     reported this route as expanding to zero pages. */
  "/partner-with-us/[slug]": slugsIn(partnershipConfig, "partnershipTracks"),
  "/departments/[slug]": slugsIn(siteConfig, "departments"),
  "/news-and-updates/[category]": ["news", "blogs"],
  /* Articles live in news-config, not site-config, and each one carries its own
     category. Reading site-config found five entries where the app renders
     seven, and forcing "news/" onto all of them invented two 404s. */
  "/news-and-updates/[category]/[slug]": categorisedSlugsIn(newsConfig, "articles").map(
    (a) => `${a.category ?? "news"}/${a.slug}`,
  ),
  "/for-organisations/[slug]": slugsIn(organisationConfig, "organisationServices"),
};

/* Routes whose parameters are not knowable from seed data. Recorded as such
   rather than left blank, because "runtime-resolved" is a real answer and a
   silent gap is not. */
const RUNTIME_RESOLVED = {
  "/who-we-are/[slug]": "Firestore custom pages (getCmsWhoWeAreDynamicPages), no seed",
  "/apply-for-training/courses/[slug]": "live course catalogue (lib/api/training)",
  "/programs/[category]": "force-dynamic, from getCourseCatalog()",
};

/* ----------------------------------------------------- reconciliation sources */

// 1. Navigation config: hrefs reachable from the menus.
const navHrefs = new Set(
  [...siteConfig.matchAll(/href:\s*"(\/[^"]*)"/g)].map((m) => m[1]),
);

// 2. Sitemap: routes advertised externally.
const sitemapSrc = src("app/sitemap.ts");
const sitemapHrefs = new Set(
  [...sitemapSrc.matchAll(/["'`](\/[a-z0-9\-/\[\]]*)["'`]/gi)].map((m) => m[1]),
);

// 3. Redirects and rewrites.
const nextConfig = src("next.config.mjs");
const redirects = [...nextConfig.matchAll(/source:\s*["']([^"']+)["'][\s\S]{0,120}?destination:\s*["']([^"']+)["']/g)]
  .map((m) => ({ from: m[1], to: m[2] }));

// 4. Internal links written into seed copy across every content file.
const allContent = [siteConfig, trainingConfig, partnershipConfig, organisationConfig, impactConfig, newsConfig].join("\n");
const contentLinks = new Set(
  [...allContent.matchAll(/href:\s*"(\/[^"#?]*)"/g)].map((m) => m[1]).filter(Boolean),
);

/* ------------------------------------------------------------------ matching */

const staticPublic = new Set(publicPages.filter((r) => !r.route.includes("[")).map((r) => r.route));
const dynamicPublic = publicPages.filter((r) => r.route.includes("["));

/* Every built route, including admin and auth: a link to /admin/team is not a
   dead link just because /admin is outside the public surface. */
const allStatic = new Set(pages.filter((r) => !r.route.includes("[")).map((r) => r.route));
const allDynamic = pages.filter((r) => r.route.includes("["));

/** Does a concrete path match a built route, static or dynamic? */
function isServed(path) {
  if (allStatic.has(path)) return true;
  // A file shipped from public/ is served by the static handler, not a route.
  if (existsSync(join(ROOT, "public", path.replace(/^\//, "")))) return true;
  const parts = path.split("/").filter(Boolean);
  return allDynamic.some((r) => {
    const rp = r.route.split("/").filter(Boolean);
    if (rp.length !== parts.length) return false;
    return rp.every((seg, i) => seg.startsWith("[") || seg === parts[i]);
  });
}

const expandedCount = dynamicPublic.reduce(
  (n, r) => n + (EXPANSIONS[r.route]?.length ?? 0),
  0,
);

const deadContentLinks = [...contentLinks]
  .filter((l) => l !== "/" && !isServed(l))
  .filter((l) => !redirects.some((r) => r.from === l))
  .sort();

const unreachable = [...staticPublic]
  .filter((r) => r !== "/" && !navHrefs.has(r) && !contentLinks.has(r))
  .sort();

const notInSitemap = [...staticPublic]
  .filter((r) => ![...sitemapHrefs].some((s) => s === r))
  .sort();

/* -------------------------------------------------------------------- report */

const report = {
  totals: {
    publicPageFiles: publicPages.length,
    publicRoutesAfterExpansion:
      publicPages.filter((r) => !r.route.includes("[")).length + expandedCount,
    adminPageFiles: adminPages.length,
    authPageFiles: authPages.length,
    apiRouteFiles: apis.length,
    chromeFiles: chrome.length,
  },
  /* Counts derived from seed data are a BASELINE: Firestore may add more.
     Marked as such so nobody reads "8 pages" as a hard ceiling. */
  dynamicExpansion: dynamicPublic.map((r) => ({
    route: r.route,
    file: r.file,
    expandsTo: EXPANSIONS[r.route]?.length ?? null,
    runtime: RUNTIME_RESOLVED[r.route] ?? null,
    slugs: EXPANSIONS[r.route] ?? [],
  })),
  chrome: chrome.map((c) => ({ kind: c.kind, route: c.route, file: c.file })),
  findings: {
    deadInternalLinks: deadContentLinks,
    unreachableFromNavOrCopy: unreachable,
    missingFromSitemap: notInSitemap,
    redirects,
  },
  publicRoutes: publicPages.map((r) => r.route).sort(),
};

/* Importing this module must not print a report: the slug expanders above
   are imported by the gate test. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const t = report.totals;
    console.log("\nROUTE DISCOVERY\n");
    console.log(`  public page files           ${t.publicPageFiles}`);
    console.log(`  public routes (expanded)    ${t.publicRoutesAfterExpansion}`);
    console.log(`  admin page files            ${t.adminPageFiles}`);
    console.log(`  auth page files             ${t.authPageFiles}`);
    console.log(`  api route files             ${t.apiRouteFiles}`);
    console.log(`  layout/loading/error/404    ${t.chromeFiles}`);

    console.log("\n  DYNAMIC SEGMENTS");
    for (const d of report.dynamicExpansion) {
      const n = d.expandsTo !== null
        ? `${d.expandsTo} pages`
        : d.runtime
          ? `runtime: ${d.runtime}`
          : "UNRESOLVED";
      console.log(`    ${d.route.padEnd(40)} ${n}`);
    }

    console.log("\n  CHROME (also needs design attention)");
    for (const c of report.chrome) console.log(`    ${c.kind.padEnd(10)} ${c.file}`);

    const f = report.findings;
    console.log(`\n  FINDINGS`);
    console.log(`    dead internal links in seed copy   ${f.deadInternalLinks.length}`);
    for (const l of f.deadInternalLinks) console.log(`      ${l}`);
    console.log(`    built but unreachable from nav/copy ${f.unreachableFromNavOrCopy.length}`);
    for (const l of f.unreachableFromNavOrCopy) console.log(`      ${l}`);
    /* Computed since the first version of this script and never printed, so the
       one finding that would have caught /our-impact missing from the sitemap
       was visible only in --json. */
    console.log(`    built but missing from sitemap     ${f.missingFromSitemap.length}`);
    for (const l of f.missingFromSitemap) console.log(`      ${l}`);
    console.log(`    redirects/rewrites declared        ${f.redirects.length}`);
    for (const r of f.redirects) console.log(`      ${r.from} -> ${r.to}`);
    console.log("");
  }
}
