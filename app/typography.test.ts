import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

/**
 * The editorial direction names two typefaces: Playfair Display for display
 * headings and DM Sans for body and interface text. They are self-hosted
 * through @fontsource-variable rather than next/font/google so the build does
 * not depend on a network fetch at compile time.
 *
 * The failure this guards against is silent. If the CSS custom property loses
 * its font, or the fontsource stylesheet import is dropped from the root
 * layout, every page still builds and still renders. It just renders in the
 * fallback serif, and nobody notices until someone looks at a screenshot.
 */
const globals = readFileSync("app/globals.css", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");
const tailwind = readFileSync("tailwind.config.ts", "utf8");

describe("editorial typography foundation", () => {
  it("declares Playfair Display as the display family", () => {
    const match = globals.match(/--font-heading:\s*([^;]+);/);
    assert.ok(match, "app/globals.css declares no --font-heading custom property");
    assert.match(match[1], /Playfair Display Variable/);
    assert.match(match[1], /serif/, "--font-heading needs a serif fallback for the first paint");
  });

  it("declares DM Sans as the body family", () => {
    const match = globals.match(/--font-body:\s*([^;]+);/);
    assert.ok(match, "app/globals.css declares no --font-body custom property");
    assert.match(match[1], /DM Sans Variable/);
    assert.match(match[1], /sans-serif/, "--font-body needs a sans fallback for the first paint");
  });

  it("loads both variable stylesheets in the root layout", () => {
    assert.match(layout, /@fontsource-variable\/playfair-display/);
    assert.match(layout, /@fontsource-variable\/dm-sans/);
  });

  it("imports the fonts before globals.css so the custom properties win the cascade", () => {
    const fontIndex = layout.indexOf("@fontsource-variable");
    const globalsIndex = layout.indexOf("./globals.css");
    assert.ok(fontIndex >= 0 && globalsIndex >= 0, "root layout is missing a stylesheet import");
    assert.ok(fontIndex < globalsIndex, "font stylesheets must be imported before ./globals.css");
  });

  it("points the Tailwind families at the custom properties", () => {
    assert.match(tailwind, /heading:\s*\["var\(--font-heading\)"/);
    assert.match(tailwind, /sans:\s*\["var\(--font-body\)"/);
  });

  it("leaves no reference to the retired Inter variable", () => {
    const sources = [globals, layout, tailwind];
    for (const source of sources) assert.doesNotMatch(source, /--font-inter/);
    assert.doesNotMatch(layout, /next\/font/, "the root layout should not load a next/font family any more");
  });
});
