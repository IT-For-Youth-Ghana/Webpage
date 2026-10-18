import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const pageComponents = [
  "components/home/homepage-sections.tsx",
  "components/who-we-are/who-we-are-page.tsx",
  "components/what-we-do/what-we-do-overview-page.tsx",
  "components/departments/departments-index-page.tsx",
  "components/training/apply-for-training-overview-page.tsx",
  "components/organisations/for-organisations-overview-page.tsx",
  "components/partnerships/partner-with-us-overview-page.tsx",
  "components/impact/impact-overview-page.tsx",
  "components/news/news-hub-page.tsx",
];

const expectedOrders = {
  home: ["home-hero", "home-manifesto", "home-programmes", "home-impact", "home-story", "home-involve", "home-news", "home-closing"],
  who: ["who-hero", "who-story", "who-manifesto", "who-mission", "who-principles", "who-people", "who-partners", "who-closing"],
  work: ["work-hero", "work-journey", "work-gallery", "work-index", "work-closing"],
  departments: ["departments-hero", "departments-intro", "departments-map", "departments-delivery", "departments-systems", "departments-communications", "departments-people", "departments-index", "departments-closing"],
  training: ["training-hero", "training-intro", "training-pathway", "training-courses", "training-experience", "training-eligibility", "training-outcomes", "training-story", "training-apply"],
  org: ["org-hero", "org-intro", "org-services", "org-engagement", "org-evidence", "org-graduates", "org-volunteer", "org-story", "org-closing"],
  partner: ["partner-hero", "partner-intro", "partner-ecosystem", "partner-sectors", "partner-development", "partner-model", "partner-story", "partner-index", "partner-closing"],
  impact: ["impact-hero", "impact-intro", "impact-big-number", "impact-arc", "impact-reach", "impact-stats", "impact-story", "impact-evidence", "impact-closing"],
  news: ["news-hero", "news-desk", "news-ideas", "news-essay", "news-topics", "news-newsletter"],
} as const;

describe("main-page template adoption", () => {
  it("routes every main page through the shared renderer and section navigation", () => {
    for (const file of pageComponents) {
      const source = readFileSync(file, "utf8");
      assert.match(source, /PageSectionRenderer/, `${file} needs the section renderer`);
      assert.match(source, /SectionNavigation/, `${file} needs shared chapter navigation`);
      assert.doesNotMatch(source, /lucide-react/, `${file} must not bring icon-card styling into the editorial system`);
    }
  });

  it("keeps each route's adopted template chapters in a stable order", () => {
    const sources = [
      readFileSync("components/home/homepage-sections.tsx", "utf8"),
      readFileSync("lib/content/main-page-sections.ts", "utf8"),
    ].join("\n");

    for (const [page, ids] of Object.entries(expectedOrders)) {
      let previous = -1;
      for (const id of ids) {
        const position = sources.indexOf(`id: "${id}"`);
        assert.ok(position >= 0, `${page}: missing ${id}`);
        assert.ok(position > previous, `${page}: ${id} is out of template order`);
        previous = position;
      }
    }

    // /what-we-do follows the template: four named chapters, the Entrepreneurship
    // Hub's own venture path, then the three community programmes read as one idea.
    assert.match(sources, /WHAT_WE_DO_CHAPTERS = \["youth-academy", "girls-in-tech", "entrepreneurship-hub", "code-impact-challenge"\]/);
    assert.match(sources, /WHAT_WE_DO_COMMUNITY = \["rural-tech-connect", "community-outreach", "tech-clubs"\]/);
    assert.match(sources, /id: `work-programme-\$\{index \+ 1\}`/);
    assert.match(sources, /id: "work-venture", componentType: "processPath", variant: "venture"/);
    assert.match(sources, /id: "work-community", componentType: "featureCollection", variant: "overlay"/);
  });

  it("renders every declared component type through an exhaustive registry", () => {
    const types = readFileSync("types/page-sections.ts", "utf8");
    const renderer = readFileSync("components/page-sections/page-section-renderer.tsx", "utf8");
    const typeBlock = types.split("export const PAGE_SECTION_TYPES = [")[1]?.split("] as const")[0] ?? "";
    const declared = [...typeBlock.matchAll(/"([a-zA-Z]+)"/g)].map((match) => match[1]);
    assert.equal(declared.length, 12);
    for (const type of declared) assert.match(renderer, new RegExp(`case "${type}"`));
    assert.match(renderer, /assertNever\(section\)/);
  });
});
