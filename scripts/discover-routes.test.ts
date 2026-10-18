import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { categorisedSlugsIn, slugsIn } from "./discover-routes.mjs";

const read = (path: string) => readFileSync(path, "utf8");

/**
 * The route report is only as good as the arrays it reads.
 *
 * slugsIn returns an empty array when the export name does not exist, and an
 * empty array looks exactly like a route that expands to nothing. That is how
 * /partner-with-us/[slug] came to report zero pages: the script asked
 * site-config for "partnershipPages", which is not there, while the five real
 * pages sit in partnership-config as "partnershipTracks". Nothing failed. The
 * document simply said a section of the site did not exist.
 *
 * Every seed-backed expansion is therefore asserted non-empty by name.
 */
describe("route discovery expansions", () => {
  const sources = {
    site: read("lib/content/site-config.ts"),
    partnership: read("lib/content/partnership-config.ts"),
    organisation: read("lib/content/organisation-config.ts"),
    news: read("lib/content/news-config.ts"),
  };

  const expansions: [string, string, string][] = [
    ["initiatives", "site", "/what-we-do/[slug]"],
    ["departments", "site", "/departments/[slug]"],
    ["partnershipTracks", "partnership", "/partner-with-us/[slug]"],
    ["organisationServices", "organisation", "/for-organisations/[slug]"],
  ];

  for (const [exportName, key, route] of expansions) {
    it(`resolves ${exportName} for ${route}`, () => {
      const slugs = slugsIn(sources[key as keyof typeof sources], exportName);
      assert.ok(
        slugs.length > 0,
        `${route} expands to nothing: ${exportName} was not found in the ${key} config`,
      );
      assert.equal(new Set(slugs).size, slugs.length, `${exportName} declares a duplicate slug`);
    });
  }
});

/**
 * Article URLs are /news-and-updates/<category>/<slug> and the category belongs
 * to the article.
 *
 * The script used to read articles from site-config, which holds five, while
 * the app renders the eight in news-config, and then hardcoded "news/" onto
 * every one. That put all four blog articles at /news-and-updates/news/..., so
 * the report whose job is to list the URLs that exist listed URLs that 404.
 */
describe("article route expansion", () => {
  const newsConfig = read("lib/content/news-config.ts");
  const articles = categorisedSlugsIn(newsConfig, "articles");

  it("reads the articles the application renders", () => {
    assert.ok(articles.length >= 7, `found only ${articles.length} articles in news-config`);
  });

  it("gives every article a category", () => {
    const uncategorised = articles.filter((a) => !a.category).map((a) => a.slug);
    assert.deepEqual(uncategorised, [], `articles with no category:\n  ${uncategorised.join("\n  ")}`);
  });

  it("uses only categories the route accepts", () => {
    const declared = [...newsConfig.matchAll(/articleCategories: ArticleCategory\[\] = \[([^\]]+)\]/g)]
      .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));

    assert.ok(declared.length > 0, "articleCategories was not found in news-config");

    const wrong = articles
      .filter((a) => a.category && !declared.includes(a.category))
      .map((a) => `${a.category}/${a.slug}`);

    assert.deepEqual(wrong, [], `article URLs in a category the route does not serve:\n  ${wrong.join("\n  ")}`);
  });

  it("covers both categories, so a hardcoded prefix cannot pass unnoticed", () => {
    const categories = new Set(articles.map((a) => a.category));
    assert.ok(categories.has("news"));
    assert.ok(categories.has("blogs"));
  });
});

describe("route discovery report", () => {
  const script = read("scripts/discover-routes.mjs");

  it("prints every finding it computes", () => {
    // missingFromSitemap was computed from the first version and never printed,
    // so the one finding that would have caught /our-impact being absent from
    // the sitemap was visible only under --json.
    const computed = [...script.matchAll(/^\s{4}(\w+): /gm)]
      .map((match) => match[1])
      .filter((name) => ["deadInternalLinks", "unreachableFromNavOrCopy", "missingFromSitemap", "redirects"].includes(name));

    for (const finding of new Set(computed)) {
      assert.ok(
        script.includes(`f.${finding}`),
        `findings.${finding} is computed but never printed in the text report`,
      );
    }
  });

  it("does not expand routes that no longer exist", () => {
    for (const gone of ["/programs/[category]/[courseId]", "/programs/course/[courseSlug]"]) {
      assert.ok(!script.includes(gone), `${gone} was deleted but the script still expands it`);
    }
  });
});
