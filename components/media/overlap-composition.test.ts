import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const SOURCE = readFileSync("components/media/overlap-composition.tsx", "utf8");
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/** Reads a percentage back out of the class string that produces it. */
function percent(pattern: RegExp, what: string): number {
  const hit = CODE.match(pattern);
  assert.ok(hit, `${what}: no class matched ${pattern}`);
  return Number(hit[1]);
}

describe("overlap composition", () => {
  it("keeps both images in one figure under one caption", () => {
    assert.equal((CODE.match(/<figure[\s>]/g) ?? []).length, 1);
    assert.equal((CODE.match(/<figcaption[\s>]/g) ?? []).length, 1);
    // The place and the person are one subject. Two figures would announce two.
    assert.ok(!/<\/figure>[\s\S]*<figure[\s>]/.test(CODE));
  });

  it("overlaps the portrait onto 18% of the plate's width", () => {
    // §5.8 states the overlap as a fraction of the PLATE, but the classes are
    // fractions of the ROW, so the two are only equal by arithmetic. This is
    // that arithmetic, so editing either class without the other fails here.
    const plateInset = percent(/lg:ms-\[(\d+(?:\.\d+)?)%\]/, "plate inset");
    const portraitWidth = percent(/lg:w-\[(\d+(?:\.\d+)?)%\]/, "portrait width");

    const plateWidth = 100 - plateInset;
    const overlapOfPlate = ((portraitWidth - plateInset) / plateWidth) * 100;

    assert.ok(
      Math.abs(overlapOfPlate - 18) < 1,
      `overlap is ${overlapOfPlate.toFixed(1)}% of the plate, §5.8 requires 18%`,
    );
    assert.ok(portraitWidth > plateInset, "the frames do not touch, so there is no overlap");
  });

  it("reserves enough room below for the portrait's overhang", () => {
    // The clipping bug: the portrait drops past the plate's lower edge, and if
    // the row does not reserve that space the next section cuts the portrait in
    // half. Percentage margin resolves against the row's INLINE size, which is
    // why the reserve is expressed against width and not height.
    const portraitWidth = percent(/lg:w-\[(\d+(?:\.\d+)?)%\]/, "portrait width");
    const drop = percent(/lg:translate-y-\[(\d+(?:\.\d+)?)%\]/, "portrait drop");
    const reserved = percent(/lg:mb-\[(\d+(?:\.\d+)?)%\]/, "reserved space");

    const portraitHeight = portraitWidth * (5 / 4); // 4:5 frame, as % of row width
    const overhang = portraitHeight * (drop / 100);

    assert.ok(
      reserved >= overhang - 0.05,
      `reserved ${reserved}% of row width, overhang needs ${overhang.toFixed(2)}%`,
    );
    assert.equal(drop, 12, "§5.8 fixes the drop at 12% of the portrait's height");
  });

  it("removes the overlap below 1024px instead of shrinking it", () => {
    // A 33%-wide portrait at 360px is 119px, which is a portrait of nobody.
    assert.match(CODE, /lg:absolute/);
    assert.ok(
      !/(^|[\s"])absolute[\s"]/.test(CODE.replace(/lg:absolute/g, "")),
      "the portrait must be statically positioned below lg",
    );
    assert.match(CODE, /lg:bottom-0/);
    assert.match(CODE, /"relative mt-6 aspect-\[4\/5\] w-2\/3/, "stacked two-thirds portrait below lg");
  });

  it("holds the two ratios and their sizes attributes together", () => {
    assert.match(CODE, /aspect-\[16\/9\]/);
    assert.match(CODE, /aspect-\[4\/5\]/);
    assert.ok(CODE.includes('"(min-width: 1024px) 62vw, 100vw"'));
    assert.ok(CODE.includes('"(min-width: 1024px) 26vw, 60vw"'));
  });

  it("treats a missing portrait as a plain wide plate, not a hole", () => {
    assert.match(CODE, /portrait\?:/, "the portrait must be optional");
    assert.match(CODE, /hasPortrait && "lg:ms-\[18%\]"/, "with no portrait the plate takes the full measure");
  });

  it("never substitutes a stock face for a named person", () => {
    assert.match(CODE, /fallbackVariant \?\? "monogram"/);
  });

  it("routes every image through the remote-image contract", () => {
    assert.match(SOURCE, /from "@\/components\/media\/remote-image"/);
    assert.ok(!/<img\b/.test(SOURCE));
    assert.ok(!/from "next\/image"/.test(SOURCE));
    assert.match(CODE, /src\?:\s*string \| null/);
  });
});
