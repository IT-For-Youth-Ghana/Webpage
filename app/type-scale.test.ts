import assert from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

/**
 * Prose renders at the size the design system specifies.
 *
 * The drift this catches: docs/redesign/design-system.md sets body at
 * 1.0625rem and app/globals.css sets `body { font-size: 1.0625rem }` to match,
 * but Tailwind's `text-sm` is 0.875rem in absolute rem, so hundreds of
 * paragraphs rendered at 14px inside a 17px document. Nothing failed. The site
 * simply read three points smaller than it was drawn, everywhere at once, and
 * the only symptom was someone saying the text looked small.
 */
const CONFIG = readFileSync("tailwind.config.ts", "utf8");
const GLOBALS = readFileSync("app/globals.css", "utf8");

/** docs/redesign/design-system.md, the type block. */
const DESIGN_SYSTEM = {
  body: "1.0625rem",
  bodyLong: "1.125rem",
  caption: "0.8125rem",
};

function configuredSize(key: string) {
  const match = CONFIG.match(new RegExp(`\\b${key}: \\["([^"]+)", \\{ lineHeight: "([^"]+)" \\}\\]`));
  assert.ok(match, `theme.extend.fontSize.${key} must be a [size, { lineHeight }] pair`);
  return { size: match[1], lineHeight: match[2] };
}

describe("the reading scale", () => {
  it("puts body text at the size the design system specifies", () => {
    assert.equal(configuredSize("base").size, DESIGN_SYSTEM.body);
    assert.equal(configuredSize("lg").size, DESIGN_SYSTEM.bodyLong);
    assert.equal(configuredSize("xs").size, DESIGN_SYSTEM.caption);
  });

  it("keeps the document default and the body token in step", () => {
    // If these diverge, an unstyled paragraph and a `text-base` one render at
    // different sizes on the same page.
    assert.ok(
      GLOBALS.includes(`font-size: ${DESIGN_SYSTEM.body}`),
      "app/globals.css body font-size must equal the base token",
    );
  });

  it("never lets a named size fall back below the small-print floor", () => {
    const floor = 0.9375;
    for (const key of ["sm", "base", "lg"]) {
      const rem = Number.parseFloat(configuredSize(key).size);
      assert.ok(rem >= floor, `text-${key} is ${rem}rem, below the ${floor}rem floor for running text`);
    }
  });

  it("pairs every size with its own line height", () => {
    for (const key of ["xs", "sm", "base", "lg"]) {
      const { lineHeight } = configuredSize(key);
      assert.ok(
        Number.parseFloat(lineHeight) >= 1.5,
        `text-${key} has line-height ${lineHeight}; running text needs 1.5 or more`,
      );
    }
  });
});

describe("prose elements use the prose sizes", () => {
  /** Uppercase, wide tracking or sr-only means the element is a label. */
  const LABEL = /uppercase|tracking-\[0\.[123]|sr-only/;
  const TOO_SMALL = /\btext-xs\b|text-\[0\.[0-8]\d*rem\]/;

  /** Every opening <p> and <blockquote> tag, className included. */
  function openingTags(source: string) {
    const tags: string[] = [];
    const pattern = /<(p|blockquote)(?=[\s>])/g;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(source))) {
      let depth = 0;
      let index = match.index + match[0].length;

      while (index < source.length) {
        const char = source[index];
        if (char === "{") depth += 1;
        else if (char === "}") depth -= 1;
        else if (char === ">" && depth === 0) break;
        index += 1;
      }

      tags.push(source.slice(match.index, index));
    }

    return tags;
  }

  it("keeps running text off the label sizes", () => {
    const offenders: string[] = [];

    for (const file of globSync("components/**/*.tsx")) {
      // The admin is a dense working surface, not a reading surface, and its
      // density is deliberate.
      if (file.includes("/admin/")) continue;

      for (const tag of openingTags(readFileSync(file, "utf8"))) {
        if (LABEL.test(tag)) continue;
        if (TOO_SMALL.test(tag)) offenders.push(`${file}: ${tag.replace(/\s+/g, " ").slice(0, 110)}`);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      `these paragraphs are set at a label size:\n  ${offenders.join("\n  ")}`,
    );
  });
});
