#!/usr/bin/env node
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const adapters = read("lib/content/main-page-sections.ts");
const homepage = read("components/home/homepage-sections.tsx");
const renderer = read("components/page-sections/page-section-renderer.tsx");
const schema = read("lib/page-sections/schema.ts");
const contract = read("types/page-sections.ts");
const hero = read("components/page-sections/editorial-hero.tsx");

const pages = [
  { route: "/", template: "01-homepage.html", component: "components/home/homepage-sections.tsx", ids: ["home-hero", "home-manifesto", "home-programmes", "home-impact", "home-story", "home-involve", "home-news", "home-closing"] },
  { route: "/who-we-are", template: "02-who-we-are.html", component: "components/who-we-are/who-we-are-page.tsx", ids: ["who-hero", "who-story", "who-manifesto", "who-mission", "who-principles", "who-people", "who-partners", "who-closing"] },
  { route: "/what-we-do", template: "03-what-we-do.html", component: "components/what-we-do/what-we-do-overview-page.tsx", ids: ["work-hero", "work-journey", "work-venture", "work-community", "work-gallery", "work-index", "work-closing"] },
  { route: "/departments", template: "04-departments.html", component: "components/departments/departments-index-page.tsx", ids: ["departments-hero", "departments-intro", "departments-map", "departments-delivery", "departments-systems", "departments-communications", "departments-people", "departments-index", "departments-closing"] },
  { route: "/apply-for-training", template: "05-apply-for-training.html", component: "components/training/apply-for-training-overview-page.tsx", ids: ["training-hero", "training-intro", "training-pathway", "training-courses", "training-experience", "training-eligibility", "training-outcomes", "training-story", "training-apply"] },
  { route: "/for-organisations", template: "06-for-organisations.html", component: "components/organisations/for-organisations-overview-page.tsx", ids: ["org-hero", "org-intro", "org-services", "org-engagement", "org-evidence", "org-graduates", "org-volunteer", "org-story", "org-closing"] },
  { route: "/partner-with-us", template: "07-partner-with-us.html", component: "components/partnerships/partner-with-us-overview-page.tsx", ids: ["partner-hero", "partner-intro", "partner-ecosystem", "partner-sectors", "partner-development", "partner-model", "partner-story", "partner-index", "partner-closing"] },
  { route: "/our-impact", template: "08-our-impact.html", component: "components/impact/impact-overview-page.tsx", ids: ["impact-hero", "impact-intro", "impact-big-number", "impact-arc", "impact-reach", "impact-stats", "impact-story", "impact-evidence", "impact-closing"] },
  { route: "/news-and-updates", template: "09-news-and-updates.html", component: "components/news/news-hub-page.tsx", ids: ["news-hero", "news-desk", "news-ideas", "news-essay", "news-topics", "news-newsletter"] },
];

const checks = [];
const check = (name, pass, detail) => checks.push({ name, pass, detail });

for (const page of pages) {
  const template = read(`docs/design_templates/${page.template}`);
  const component = read(page.component);
  check(`${page.route}: template exists`, template.includes("<main>"), page.template);
  check(`${page.route}: shared renderer`, component.includes("PageSectionRenderer") && component.includes("SectionNavigation"), page.component);

  const source = page.route === "/" ? homepage : adapters;
  let prior = -1;
  let ordered = true;
  for (const id of page.ids) {
    const index = source.indexOf(`id: "${id}"`);
    if (index < 0 || index <= prior) ordered = false;
    prior = index;
  }
  check(`${page.route}: section order`, ordered, page.ids.join(" → "));
}

check("/what-we-do: four template chapters", adapters.includes('WHAT_WE_DO_CHAPTERS = ["youth-academy", "girls-in-tech", "entrepreneurship-hub", "code-impact-challenge"]') && adapters.includes("id: `work-programme-${index + 1}`"), "four CMS-backed editorial chapters");
check("/what-we-do: venture path", adapters.includes('id: "work-venture", componentType: "processPath", variant: "venture"'), "the Entrepreneurship Hub's own four-stage path");
check("/what-we-do: community cluster", adapters.includes('id: "work-community", componentType: "featureCollection", variant: "overlay"'), "three community programmes read as one idea");
const typeBlock = contract.split("export const PAGE_SECTION_TYPES = [")[1]?.split("] as const")[0] ?? "";
const types = [...typeBlock.matchAll(/"([a-zA-Z]+)"/g)].map((match) => match[1]);
check("registry: 12 declared types", types.length === 12, `${types.length} found`);
for (const type of types) {
  check(`registry: ${type} renderer`, renderer.includes(`case "${type}"`), "exhaustive render switch");
  check(`registry: ${type} schema`, schema.includes(`z.literal("${type}")`), "discriminated Zod schema");
}
check("registry: exhaustive fallback", renderer.includes("assertNever(section)"), "compile-time exhaustiveness");
check("accessibility: no placeholder links", !renderer.includes('href={item.action?.href ?? "#"}'), "non-links render as semantic articles");
check("accessibility: reduced motion", hero.includes("prefers-reduced-motion: reduce"), "autoplay disabled");
check("hero: desktop image left, copy right", hero.includes("lg:left-5") && hero.includes("lg:ml-auto"), "mirrored editorial composition");
check("hero: laptop viewport fit", hero.includes("lg:min-h-[clamp(560px,calc(100svh-10rem),640px)]") && hero.includes("lg:py-5"), "viewport-aware height from 560px to 640px");

const passed = checks.filter((item) => item.pass).length;
const score = Math.round((passed / checks.length) * 100);
for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"}  ${item.name}  ${item.detail}`);
console.log(`\nMAIN PAGE ADOPTION SCORE: ${score}% (${passed}/${checks.length})`);
if (score < 100) process.exitCode = 1;
