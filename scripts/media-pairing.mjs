#!/usr/bin/env node
/**
 * Media-pairing gap analysis for the ITFYG redesign.
 *
 * Every substantive text block on a public page should be paired with a
 * visual. This walks each public route's section components and reports which
 * of them render media and which are text-only, so the gap list is derived
 * from the code rather than from reading pages one at a time.
 *
 * A section counts as paired when it renders next/image, a video element or
 * embed, or one of the shared media primitives. A gradient with no content
 * does not count and is reported separately, because a placeholder that looks
 * like a design decision is worse than an obvious hole.
 *
 * Usage: node scripts/media-pairing.mjs [--json]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");

const GROUP = /^\(.+\)$/;
function walkPages(dir, segments = [], out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkPages(full, GROUP.test(entry) ? segments : [...segments, entry], out);
    else if (entry === "page.tsx") out.push({ file: relative(ROOT, full), route: "/" + segments.join("/") });
  }
  return out;
}

const pages = walkPages(join(ROOT, "app", "(public)"))
  .map((p) => ({ ...p, route: p.route === "/" ? "/" : p.route.replace(/\/$/, "") }))
  .sort((a, b) => a.route.localeCompare(b.route));

function resolveComponent(spec) {
  if (!spec.startsWith("@/components/")) return null;
  const base = spec.replace("@/", "");
  for (const ext of [".tsx", ".ts"]) if (existsSync(join(ROOT, base + ext))) return base + ext;
  return null;
}

/** Component files a page pulls in, one level deep plus their own children. */
function componentTree(file, depth = 2, seen = new Set()) {
  if (depth === 0 || seen.has(file)) return [];
  seen.add(file);
  const text = read(file);
  const out = [];
  for (const m of text.matchAll(/from\s+"(@\/components\/[^"]+)"/g)) {
    const target = resolveComponent(m[1]);
    if (!target || seen.has(target)) continue;
    out.push(target, ...componentTree(target, depth - 1, seen));
  }
  return out;
}

const MEDIA_SIGNALS = [
  /from "next\/image"/,
  /<ContentImage/, /<VideoCard/, /<CapsuleMedia/, /<InitiativeGallery/,
  /<WhatWeDoGallery/, /<iframe/, /<video/,
  /* Treatment primitives from the orientation rule. Wide for programme content,
     portrait for people, circular for either. */
  /<MediaBand/, /<WideFrame/, /<OffsetFrames/, /<PortraitFigure/, /<CircularFigure/,
  /<StorySection/,
];
/**
 * A gradient standing in for a photograph, which the media policy bans outright.
 *
 * The distinction that matters is scrim versus substitute, and colour alone
 * cannot tell them apart. A scrim, a vignette or an accent wash sits over a
 * real photograph to keep overlaid type legible, and is correct. A substitute
 * fills a media slot that has no photograph in it, and must never ship: it
 * looks like a design decision, so nobody ever replaces it.
 *
 * Both compile to an empty absolutely-positioned div, and both mix opaque and
 * translucent stops, so stop colours are not the discriminator. Position in the
 * JSX is. A substitute is what renders *instead of* the image, meaning it sits
 * in the else branch of the conditional that would otherwise have rendered
 * media. A scrim renders alongside the image, never in its place.
 *
 * So: a gradient-filled empty div whose immediately preceding tokens close a
 * ternary and open its alternative is a substitute. Anything else is a wash.
 */
export function findPlaceholderGradients(source) {
  const found = [];
  for (const match of source.matchAll(/<div[^>]*?\/>/g)) {
    const el = match[0];
    if (!/(linear|radial)-gradient/.test(el)) continue;

    const before = source
      .slice(0, match.index)
      .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}\s*$/, "")
      .replace(/\s+$/, "");
    if (!/\)\s*:\s*\($/.test(before)) continue;

    found.push(el.slice(0, 120));
  }
  return found;
}

const TEXT_SIGNALS = [/<p[\s>]/, /<h2[\s>]/, /<h3[\s>]/, /leading-\[?1?\.?[678]/];

const SHELL = /(site-header|site-footer|announcement-bar|floating-elements|page-container)/;

/* Not text blocks. A section opener, a grid of links, a form or a set of pills
   is structure or navigation, and asking it to carry a photograph produces
   nonsense guidance rather than a better page. */
const STRUCTURAL = /(section-intro|page-header|section-heading|route-card-grid|panel-list|label-pills|breadcrumb|button|form-field|state-message|newsletter-signup-form|contact-form|capsule-actions|capsule-content|capsule-shell|slideshow-controls|slideshow-stage|use-slideshow|split-heading)/;

/* The addendum counts a purposeful graphic form as a pairing when it encodes
   real structure rather than decorating: a sequence drawn as a line, a tree
   over real groupings, figures drawn from real numbers. */
const GRAPHIC_FORM = /(process-sequence|pathway-tree|stats-section|stat-list|impact-counter|initiative-orbit|cohort-timeline|marquee-ticker)/;

const rows = pages.map((p) => {
  const tree = [...new Set(componentTree(p.file))].filter((f) => !SHELL.test(f));
  /* A component that delegates its media to a child is still paired as far as a
     reader is concerned: news-listing-page renders ArticleCard, which renders
     the cover image. Evaluating each file in isolation reported those parents as
     unpaired, so pairing is resolved one level through the components a file
     actually renders. */
  const ownMedia = (file) => MEDIA_SIGNALS.some((r) => r.test(read(file)));

  /* A hero pairs ITSELF, not the body sections below it. Every page has a hero
     with an image, so counting it as delegation would mark every page paired and
     make the measure meaningless. */
  const HERO = /(editorial-image-hero|capsule-page-hero|hero-capsule|page-header)/;

  const delegatesMedia = (file) => {
    const text = read(file);
    for (const m of text.matchAll(/from\s+"(@\/components\/[^"]+)"/g)) {
      if (HERO.test(m[1])) continue;
      const target = resolveComponent(m[1]);
      if (!target) continue;
      const child = target.split("/").pop().replace(/\.tsx?$/, "");
      // Only count it if the child is actually rendered here.
      const rendered = new RegExp(`<${child.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())}[\\s/>]`);
      if (rendered.test(text) && ownMedia(target)) return true;
    }
    return false;
  };

  const sections = tree.map((file) => {
    const text = read(file);
    const name = file.split("/").pop().replace(".tsx", "");
    const hasMedia = ownMedia(file) || delegatesMedia(file);
    const graphic = GRAPHIC_FORM.test(file);
    return {
      file,
      name,
      role: STRUCTURAL.test(file) ? "structural" : graphic ? "graphic-form" : "content",
      hasMedia,
      graphicForm: graphic,
      // A graphic form that encodes real structure satisfies the rule.
      paired: hasMedia || graphic,
      hasPlaceholderGradient: findPlaceholderGradients(text).length > 0,
      hasSubstantiveText: TEXT_SIGNALS.filter((r) => r.test(text)).length >= 2,
    };
  });

  const textOnly = sections.filter(
    (s) => s.role === "content" && s.hasSubstantiveText && !s.paired,
  );
  return {
    route: p.route,
    sectionCount: sections.length,
    contentSections: sections.filter((s) => s.role === "content").length,
    paired: sections.filter((s) => s.role === "content" && s.paired).length,
    textOnly: textOnly.map((s) => s.name),
    placeholders: sections.filter((s) => s.hasPlaceholderGradient).map((s) => s.name),
    sections,
  };
});

const report = {
  totals: {
    routes: rows.length,
    componentsScanned: rows.reduce((n, r) => n + r.sectionCount, 0),
    contentSections: rows.reduce((n, r) => n + r.contentSections, 0),
    paired: rows.reduce((n, r) => n + r.paired, 0),
    textOnly: rows.reduce((n, r) => n + r.textOnly.length, 0),
    routesFullyPaired: rows.filter((r) => r.textOnly.length === 0).length,
    placeholderGradients: rows.reduce((n, r) => n + r.placeholders.length, 0),
  },
  rows,
};

/* Importing this module must not print a report: the placeholder-gradient
   detector above is imported by the gate test. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const t = report.totals;
    console.log("\nMEDIA PAIRING GAP ANALYSIS\n");
    console.log(`  public routes             ${t.routes}`);
    console.log(`  components scanned        ${t.componentsScanned}`);
    console.log(`  content sections          ${t.contentSections}   (structural and graphic-form excluded)`);
    console.log(`  paired (media or graphic) ${t.paired}`);
    console.log(`  unpaired text-only        ${t.textOnly}`);
    console.log(`  routes fully paired       ${t.routesFullyPaired} of ${t.routes}`);
    console.log(`  placeholder gradients     ${t.placeholderGradients}`);
    console.log("\n  UNPAIRED SECTIONS BY ROUTE");
    for (const r of rows.filter((x) => x.textOnly.length)) {
      console.log(`    ${r.route}`);
      for (const s of r.textOnly) console.log(`        ${s}`);
    }
    const ph = rows.filter((r) => r.placeholders.length);
    if (ph.length) {
      console.log("\n  PLACEHOLDER GRADIENTS STILL IN USE");
      for (const r of ph) console.log(`    ${r.route}  ${r.placeholders.join(", ")}`);
    }
    console.log("");
  }
}
