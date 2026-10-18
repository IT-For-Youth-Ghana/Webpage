import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

/**
 * The title template is applied by the nearest layout, so a page must supply
 * only its own name.
 *
 * app/(public)/layout.tsx sets template "%s | IT For Youth Ghana". Six pages
 * also appended the organisation name by hand, which rendered as
 * "Donate | IT For Youth Ghana | IT For Youth Ghana" in the browser tab, in
 * search results and in every link preview. Nothing failed: the string is
 * valid, the build is green, and only a human reading a tab would notice.
 *
 * openGraph.title is deliberately exempt. Next does not apply the title
 * template to it, so the organisation name there is correct and intended.
 */
/**
 * Read from source rather than imported: lib/content/site-config.ts resolves
 * "@/..." path aliases that only the bundler understands, so importing it into
 * a plain node test fails at resolution.
 */
const siteConfig = readFileSync("lib/content/site-config.ts", "utf8");
const read = (key: string) => {
  const match = siteConfig.match(new RegExp(`${key}:\\s*"([^"]+)"`));
  assert.ok(match, `lib/content/site-config.ts declares no ${key}`);
  return match[1];
};

const SITE_NAME = read("defaultTitle");
const TITLE_TEMPLATE = read("titleTemplate");

function pageFiles(dir: string, out: string[] = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) pageFiles(full, out);
    else if (entry === "page.tsx" || entry === "layout.tsx") out.push(full);
  }
  return out;
}

/** Strip every openGraph and twitter block so only templated titles remain. */
function withoutSocialBlocks(source: string) {
  let text = source;
  for (const key of ["openGraph", "twitter"]) {
    let index: number;
    while ((index = text.indexOf(`${key}: {`)) !== -1) {
      let depth = 0;
      let end = text.indexOf("{", index);
      for (let i = end; i < text.length; i += 1) {
        if (text[i] === "{") depth += 1;
        else if (text[i] === "}") {
          depth -= 1;
          if (depth === 0) {
            end = i;
            break;
          }
        }
      }
      text = text.slice(0, index) + text.slice(end + 1);
    }
  }
  return text;
}

describe("metadata titles", () => {
  it("declares the template exactly once, in the public layout", () => {
    const layout = readFileSync("app/(public)/layout.tsx", "utf8");
    assert.match(layout, /template: siteMeta\.titleTemplate/);
    assert.equal(TITLE_TEMPLATE, `%s | ${SITE_NAME}`);
  });

  it("never appends the organisation name to a templated title", () => {
    const offenders: string[] = [];

    for (const file of pageFiles("app")) {
      const source = withoutSocialBlocks(readFileSync(file, "utf8"));
      source.split("\n").forEach((line, index) => {
        if (!/^\s*title:/.test(line)) return;
        if (!line.includes(SITE_NAME)) return;
        // The layout's own default legitimately is the organisation name.
        if (/default:/.test(line) || /template:/.test(line)) return;
        offenders.push(`${file}:${index + 1} ${line.trim()}`);
      });
    }

    assert.deepEqual(
      offenders,
      [],
      `these titles render the organisation name twice once the template is applied:\n  ${offenders.join("\n  ")}`,
    );
  });
});

/**
 * Every public route carries metadata, and it is built by one function.
 *
 * The gap this closes: eight public routes exported no metadata at all and
 * twenty-two had no openGraph block, so a shared link rendered as a bare URL
 * with the layout's default description, and no route declared a canonical
 * URL on a site carrying 27 permanent redirects. None of that fails a build.
 * The only way it stays fixed is a test that reads the routes.
 */
describe("public metadata coverage", () => {
  const PUBLIC_PAGES = pageFiles("app/(public)").filter((file) => file.endsWith("page.tsx"));

  /** app/(public)/who-we-are/team/page.tsx -> /who-we-are/team */
  function routeOf(file: string) {
    const path = file
      .replace(/^app\//, "")
      .replace(/\/page\.tsx$/, "")
      .replace(/\(public\)\/?/, "");
    return `/${path}`.replace(/\/$/, "") || "/";
  }

  it("finds pages to check, so a broken glob cannot pass silently", () => {
    assert.ok(PUBLIC_PAGES.length >= 25, `expected the public routes, found ${PUBLIC_PAGES.length}`);
  });

  it("declares metadata on every public route", () => {
    const missing = PUBLIC_PAGES.filter((file) => {
      const source = readFileSync(file, "utf8");
      return !/export const metadata|export (async )?function generateMetadata/.test(source);
    });

    assert.deepEqual(missing, [], "these routes render with the layout's default title and description");
  });

  it("builds it through the shared contract rather than by hand", () => {
    const handRolled = PUBLIC_PAGES.filter(
      (file) => !readFileSync(file, "utf8").includes('from "@/lib/seo/page-metadata"'),
    );

    assert.deepEqual(
      handRolled,
      [],
      "pageMetadata() is what supplies the canonical URL and the openGraph block",
    );
  });

  it("gives every static route its own canonical path", () => {
    const wrong: string[] = [];

    for (const file of PUBLIC_PAGES) {
      const route = routeOf(file);
      // Dynamic routes build the path from their params, so there is no
      // literal to compare against.
      if (route.includes("[")) continue;

      const source = readFileSync(file, "utf8");
      if (!new RegExp(`path: "${route}"`).test(source)) {
        wrong.push(`${file} does not declare path: "${route}"`);
      }
    }

    // A copied generateMetadata block that keeps the path it was copied from
    // points two routes at one canonical URL, which is how a page disappears
    // from search results.
    assert.deepEqual(wrong, [], wrong.join("\n  "));
  });

  it("passes a path to every dynamic route too", () => {
    const missing = PUBLIC_PAGES.filter((file) => {
      if (!routeOf(file).includes("[")) return false;
      // Either an inline `path: "/x"` or the `path,` shorthand these routes
      // use after building the string from their params.
      return !/\bpath[,:]/.test(readFileSync(file, "utf8"));
    });

    assert.deepEqual(missing, [], "a dynamic route must still canonicalise itself");
  });
});
