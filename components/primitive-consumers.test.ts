import assert from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

/**
 * Every media and content primitive must be used by something.
 *
 * The failure this catches happened here: `filmstrip`, `overlap-composition`
 * and `data-table` were written, documented and unit-tested, and then shipped
 * with no call site. A primitive with no consumer is not a design system, it is
 * a folder of intentions. It also cannot regress visibly, so nothing tells you
 * when it stops working.
 *
 * A primitive that is deliberately not placed yet goes in UNPLACED with the
 * reason. That keeps the debt named in a file the test run reads, rather than
 * discovered months later by a dependency graph.
 */
const UNPLACED: Record<string, string> = {
  "components/content/quote-block.tsx":
    "A full-measure pull quote with a 9rem portrait. The two testimonial " +
    "surfaces that exist (the initiative page's three-up cards and the impact " +
    "testimonials grid) are a different treatment, so dropping it into either " +
    "would be a visual regression rather than a placement.",
};

const PRIMITIVES = globSync("components/{media,content}/*.tsx");

const CONSUMERS = globSync("{app,components,lib}/**/*.tsx").filter(
  (file) => !file.endsWith(".test.tsx"),
);

function importPathOf(file: string) {
  return `@/${file.replace(/\.tsx$/, "")}`;
}

describe("design primitives have consumers", () => {
  it("finds a call site for every placed primitive", () => {
    const orphans: string[] = [];

    for (const primitive of PRIMITIVES) {
      if (primitive in UNPLACED) continue;

      const specifier = importPathOf(primitive);
      const used = CONSUMERS.some(
        (file) => file !== primitive && readFileSync(file, "utf8").includes(`"${specifier}"`),
      );

      if (!used) orphans.push(primitive);
    }

    assert.deepEqual(
      orphans,
      [],
      "these primitives are imported by nothing. Place them, or record them in UNPLACED with the reason.",
    );
  });

  it("keeps UNPLACED honest, so a placed primitive cannot sit in it forever", () => {
    for (const [primitive, reason] of Object.entries(UNPLACED)) {
      assert.ok(PRIMITIVES.includes(primitive), `${primitive} no longer exists, drop it from UNPLACED`);
      assert.ok(reason.length > 40, `${primitive} needs a real reason, not a placeholder`);

      const specifier = importPathOf(primitive);
      const used = CONSUMERS.some(
        (file) => file !== primitive && readFileSync(file, "utf8").includes(`"${specifier}"`),
      );

      assert.ok(!used, `${primitive} now has a call site. Remove it from UNPLACED.`);
    }
  });
});
