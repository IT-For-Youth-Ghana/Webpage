import assert from "node:assert/strict";
import test from "node:test";

import { pageSectionDocumentSchema, pageSectionSchema } from "./schema.ts";

const heading = { eyebrow: "Eyebrow", title: "A useful title", body: "Supporting copy." };
const media = { src: "/images/randomPictures/groupworkstudents.jpg", alt: "Learners collaborating at laptops" };
const item = { id: "item-1", title: "Item", body: "Item body", media, action: { label: "Open", href: "/contact" } };
const metric = { id: "metric-1", value: "12", label: "Cohorts" };
const base = { id: "section-1", anchor: "section-one", navLabel: "Section one" };

const fixtures = [
  { ...base, componentType: "hero", variant: "split", slides: [{ ...heading, id: "slide-1", media }] },
  { ...base, componentType: "editorialIntro", variant: "manifesto", heading, media, metrics: [metric], items: [item] },
  { ...base, componentType: "mediaNarrative", variant: "capsule", heading, media, items: [item] },
  { ...base, componentType: "featureCollection", variant: "mosaic", heading, items: [item] },
  { ...base, componentType: "processPath", variant: "arc", heading, items: [item] },
  { ...base, componentType: "relationshipMap", variant: "network", heading, items: [item], centerLabel: "ITFYG" },
  { ...base, componentType: "metricStory", variant: "headline", heading, metrics: [metric], media },
  { ...base, componentType: "storyQuote", variant: "dark", heading, quote: "A real account.", media, verification: "verified" },
  { ...base, componentType: "linkedIndex", variant: "rows", heading, items: [item] },
  { ...base, componentType: "publicationFeed", variant: "newsDesk", heading, items: [item] },
  { ...base, componentType: "callToAction", variant: "band", heading, actions: [{ label: "Act", href: "/contact" }] },
  { ...base, componentType: "newsletterSignup", variant: "editorial", heading, interest: "news" },
] as const;

test("every registered component type has a valid persisted shape", () => {
  for (const fixture of fixtures) assert.equal(pageSectionSchema.safeParse(fixture).success, true, fixture.componentType);
});

test("unknown component types and incompatible variants are rejected", () => {
  assert.equal(pageSectionSchema.safeParse({ ...fixtures[0], componentType: "html" }).success, false);
  assert.equal(pageSectionSchema.safeParse({ ...fixtures[4], variant: "newsDesk" }).success, false);
});

test("page documents reject duplicate section identities and anchors", () => {
  const result = pageSectionDocumentSchema.safeParse({
    schemaVersion: 1,
    pageId: "home",
    sections: [fixtures[1], { ...fixtures[10], id: fixtures[1].id, anchor: fixtures[1].anchor }],
  });
  assert.equal(result.success, false);
  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message);
    assert.ok(messages.some((message) => message.includes("Duplicate section id")));
    assert.ok(messages.some((message) => message.includes("Duplicate section anchor")));
  }
});

test("page documents allow only one enabled hero", () => {
  const result = pageSectionDocumentSchema.safeParse({
    schemaVersion: 1,
    pageId: "home",
    sections: [fixtures[0], { ...fixtures[0], id: "hero-2", anchor: "hero-two" }],
  });
  assert.equal(result.success, false);
});
