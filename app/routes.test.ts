import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, it } from "node:test";

const PUBLIC_ROOT = "app/(public)";
const GROUP = /^\(.+\)$/;

type Route = { pattern: string; file: string; dynamic: boolean };

/** Every public route, with (group) segments removed the way Next removes them. */
function publicRoutes(dir = PUBLIC_ROOT, segments: string[] = [], out: Route[] = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      publicRoutes(full, GROUP.test(entry) ? segments : [...segments, entry], out);
    } else if (entry === "page.tsx") {
      const pattern = "/" + segments.join("/");
      out.push({
        pattern: pattern === "/" ? "/" : pattern.replace(/\/$/, ""),
        file: relative(".", full),
        dynamic: segments.some((s) => s.startsWith("[")),
      });
    }
  }
  return out;
}

const ROUTES = publicRoutes().sort((a, b) => a.pattern.localeCompare(b.pattern));

describe("dynamic public routes", () => {
  /**
   * A dynamic route that cannot resolve its entity must answer 404.
   *
   * /apply-for-training/courses/[slug] used to answer HTTP 200 for any slug at
   * all, with a heading title-cased from the URL. /programs/[category] answered
   * 200 with the entire catalogue for any category string. Both are soft 404s,
   * both get indexed, and neither shows up as an error anywhere: the page
   * renders, the build is green, and the logs are clean.
   *
   * Course slugs come from an external API, so the supply of wrong ones has no
   * upper bound.
   */
  it("call notFound() when the entity does not resolve", () => {
    const missing = ROUTES.filter((route) => route.dynamic)
      .filter((route) => !readFileSync(route.file, "utf8").includes("notFound()"))
      .map((route) => `${route.pattern}  (${route.file})`);

    assert.deepEqual(
      missing,
      [],
      `these dynamic routes render something for every possible parameter:\n  ${missing.join("\n  ")}`,
    );
  });
});

/** Redirect rules as declared, read from source rather than by evaluating the config. */
function redirectRules() {
  const config = readFileSync("next.config.mjs", "utf8");
  const block = config.slice(config.indexOf("async redirects"));
  const rules: { source: string; destination: string }[] = [];

  const pattern = /source:\s*"([^"]+)",\s*\n\s*destination:\s*"([^"]+)"/g;
  for (const match of block.matchAll(pattern)) {
    rules.push({ source: match[1], destination: match[2] });
  }
  return rules;
}

/** Does a concrete path match a route pattern, treating [param] as one segment? */
function matchesRoute(path: string) {
  const parts = path.split("/").filter(Boolean);
  return ROUTES.some((route) => {
    const routeParts = route.pattern.split("/").filter(Boolean);
    if (routeParts.length !== parts.length) return false;
    return routeParts.every((segment, index) => segment.startsWith("[") || segment === parts[index]);
  });
}

describe("redirects", () => {
  const rules = redirectRules();

  it("are all parsed", () => {
    assert.ok(rules.length >= 25, `parsed only ${rules.length} redirect rules out of next.config.mjs`);
  });

  it("point at a route that exists", () => {
    const broken = rules
      .filter((rule) => {
        const target = rule.destination.split("#")[0].split("?")[0];
        // A :param in the destination fills a [param] segment in the route.
        const normalised = target.replace(/:[^/]+/g, "x");
        return !matchesRoute(normalised) && !existsSync(join("public", target));
      })
      .map((rule) => `${rule.source} -> ${rule.destination}`);

    assert.deepEqual(broken, [], `redirects pointing at nothing:\n  ${broken.join("\n  ")}`);
  });

  it("never shadow a live route", () => {
    // Next applies redirects before routing, so a rule whose source matches a
    // real page makes that page permanently unreachable.
    const shadowed = rules
      .filter((rule) => !rule.source.includes(":"))
      .filter((rule) => ROUTES.some((route) => route.pattern === rule.source))
      .map((rule) => `${rule.source} is a real page and a redirect source`);

    assert.deepEqual(shadowed, [], shadowed.join("\n  "));
  });

  it("retire both duplicate course-detail URL shapes", () => {
    const sources = rules.map((rule) => rule.source);
    assert.ok(sources.includes("/programs/course/:courseSlug"));
    assert.ok(sources.includes("/programs/:category/:courseId"));
    assert.equal(existsSync("app/(public)/programs/course"), false);
    assert.equal(existsSync("app/(public)/programs/[category]/[courseId]"), false);
  });
});

/**
 * The sitemap's static list and the route files must agree in both directions.
 *
 * /our-impact reached the sitemap only by being spread in from
 * publicNavigation, so a purely editorial decision to drop it from the menu
 * would also have dropped the impact hub out of search. Nothing would have
 * failed. Deriving indexability from a navigation menu is the bug; this test
 * is what stops it coming back.
 */
describe("sitemap coverage", () => {
  const source = readFileSync("app/sitemap.ts", "utf8");
  const listed = [
    ...source
      .slice(source.indexOf("const STATIC_ROUTES"), source.indexOf("type Entry"))
      .matchAll(/"(\/[^"]*)"/g),
  ].map((match) => match[1]);

  const staticRoutes = ROUTES.filter((route) => !route.dynamic).map((route) => route.pattern);

  it("parses the static list", () => {
    assert.ok(listed.length >= 20, `parsed only ${listed.length} routes out of app/sitemap.ts`);
  });

  it("lists every static public route", () => {
    const missing = staticRoutes.filter((pattern) => !listed.includes(pattern));
    assert.deepEqual(missing, [], `public routes absent from the sitemap:\n  ${missing.join("\n  ")}`);
  });

  it("lists nothing that is not a route", () => {
    // A listed URL may be served by a dynamic segment: /news-and-updates/news
    // and /news-and-updates/blogs are both real pages under [category].
    const phantom = listed.filter((pattern) => !matchesRoute(pattern));
    assert.deepEqual(phantom, [], `sitemap entries with no page:\n  ${phantom.join("\n  ")}`);
  });

  it("does not stamp every entry with the current time", () => {
    // lastModified: new Date() on every URL tells a crawler the whole site
    // changed on every fetch, which is the same as telling it nothing.
    assert.doesNotMatch(
      source,
      /lastModified:\s*new Date\(\)/,
      "sitemap fabricates a modification date for entries that have none",
    );
  });

  it("includes the canonical course URLs", () => {
    assert.match(source, /apply-for-training\/courses\/\$\{slug\}/);
    assert.match(source, /getTrainingCatalogMixed/);
  });
});
