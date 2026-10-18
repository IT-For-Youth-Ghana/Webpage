import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const SOURCE = readFileSync("components/shared/careers-list.tsx", "utf8");
const GALLERY = readFileSync("components/what-we-do/initiative-page.tsx", "utf8");

/**
 * Open roles are a comparison, and comparisons are tables.
 *
 * The stack of cards this replaced held the same five attributes for every
 * role, unaligned, so answering "which of these closes first" meant scrolling
 * the page and re-reading the label above each date. The assertions below are
 * the properties that make the table answer that question instead.
 */
describe("careers list", () => {
  it("renders the roles as a table, not a card stack", () => {
    assert.match(SOURCE, /import \{ DataTable/, "the roles are tabular data");
    for (const banned of ["@/components/ui/card", "grid gap-5"]) {
      assert.ok(!SOURCE.includes(banned), `the card stack must be gone, found ${banned}`);
    }
  });

  it("gives every attribute a column of its own", () => {
    for (const key of ["role", "focus", "team", "location", "type", "closes", "apply"]) {
      assert.ok(
        new RegExp(`key: "${key}"`).test(SOURCE),
        `${key} must be a column, so it can be compared down the page`,
      );
      assert.ok(new RegExp(`\\b${key}:`).test(SOURCE), `${key} must be populated on every row`);
    }
  });

  it("aligns the closing date to the trailing edge", () => {
    // Dates are compared vertically. Ragged leading alignment defeats that.
    assert.match(SOURCE, /key: "closes", header: "Closes", width: "narrow", numeric: true/);
  });

  it("keeps the machine-readable date beside the readable one", () => {
    assert.match(SOURCE, /<time dateTime=\{closingDate\}>\{formatDate\(closingDate\)\}<\/time>/);
    assert.match(SOURCE, /Number\.isNaN\(parsed\.getTime\(\)\)/, "an unparseable date must render as stored, not as Invalid Date");
  });

  it("says so when a role has no closing date", () => {
    // "Not stated" is wrong here: an open-ended role is a fact about the role.
    assert.match(SOURCE, /Open until filled/);
  });

  it("names its links for a screen reader reading them out of context", () => {
    // A column of links all reading "Apply" is unusable when the reader is
    // moving link to link rather than row to row.
    assert.match(SOURCE, /sr-only"> for \{job\.title\}, opens in a new tab</);
    assert.match(SOURCE, /sr-only"> about \{job\.title\}</);
    assert.match(SOURCE, /rel="noreferrer noopener"/, "an external apply link must not leak the opener");
  });

  it("names the table for anyone navigating by table", () => {
    assert.match(SOURCE, /captionVisible=\{false\}/, "the visible h2 already names the section");
    assert.match(SOURCE, /caption=\{`\$\{jobs\.length\} open \$\{jobs\.length === 1 \? "role" : "roles"\}/);
  });

  it("still handles having no roles at all", () => {
    assert.match(SOURCE, /if \(!jobs\.length\)/);
    assert.match(SOURCE, /No open roles right now/);
  });

  it("pairs the place with a person in one figure", () => {
    assert.match(SOURCE, /import \{ OverlapComposition/);
    assert.ok(
      !SOURCE.includes("WideFrame"),
      "the lone wide plate is replaced by the composition, not left beside it",
    );
    // Honest alt: what the photograph shows, never a claim about who is in it.
    assert.ok(!/alt: "[^"]*\b(our team|ITFYG staff)\b/i.test(SOURCE));
  });
});

describe("initiative gallery", () => {
  it("is a scroll strip with no modal to trap a keyboard user", () => {
    assert.match(GALLERY, /import \{ Filmstrip/);
    assert.ok(
      !GALLERY.includes("InitiativeGallery"),
      "the lightbox component is removed, not merely unused",
    );
  });

  it("drops legacy entries with no alt text rather than rendering them mute", () => {
    assert.match(
      GALLERY,
      /page\.gallery\.filter\(\(image\) => hasText\(image\.src\) && hasText\(image\.alt\)\)/,
    );
  });

  it("names the scroll region, because an unnamed scroller is a trap", () => {
    assert.match(GALLERY, /label=\{hasText\(section\.galleryTitle\)/);
  });
});
