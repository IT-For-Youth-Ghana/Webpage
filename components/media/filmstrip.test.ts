import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

/**
 * The filmstrip's contract is entirely mechanical, so it is checked
 * mechanically. Every assertion here corresponds to a way the treatment has
 * historically been got wrong: a carousel instead of a scroll row, a hidden
 * scrollbar, a keyboard user who cannot reach the frames, a last frame that can
 * never snap into view, or an `img` that bypasses the remote-image contract.
 */
const SOURCE = readFileSync("components/media/filmstrip.tsx", "utf8");

/** Code only. The doc comment names the banned patterns in order to ban them. */
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("filmstrip", () => {
  it("is a native scroll-snap row, not a carousel", () => {
    assert.match(SOURCE, /overflow-x-auto/, "the row must scroll natively");
    assert.match(SOURCE, /snap-x snap-mandatory/, "§5.7 requires x mandatory snapping");
    assert.match(SOURCE, /snap-start/, "each frame must be a snap target");

    for (const banned of ["useState", "useEffect", "setInterval", "autoPlay", "carousel"]) {
      assert.ok(!CODE.includes(banned), `filmstrip must stay controller-free, found ${banned}`);
    }
    assert.ok(!CODE.includes('"use client"'), "a scroll row needs no client boundary");
  });

  it("leaves the scrollbar visible", () => {
    // Hiding it removes the only indication to a pointer user that the row
    // continues past the viewport edge.
    assert.ok(!/scrollbar-hide|scrollbar-none|::-webkit-scrollbar/.test(CODE));
  });

  it("lets the last frame reach the leading edge", () => {
    const gutter = "clamp(1rem,4vw,3.5rem)";
    assert.ok(SOURCE.includes(`scroll-pl-[${gutter}]`), "scroll-padding-inline-start must equal --gutter");
    assert.ok(SOURCE.includes(`scroll-pr-[${gutter}]`), "scroll-padding-inline-end must equal --gutter");
    assert.ok(SOURCE.includes(`pe-[${gutter}]`), "the trailing gutter must equal --gutter");
  });

  it("is reachable and pannable by keyboard", () => {
    assert.match(SOURCE, /role="group"/);
    assert.match(SOURCE, /aria-label=\{label\}/);
    assert.match(SOURCE, /tabIndex=\{0\}/);
    assert.match(SOURCE, /focus-visible:outline-2/);
  });

  it("resolves hover and focus to the same state, and neither under reduced motion", () => {
    assert.match(SOURCE, /group-hover:-translate-y-1 group-focus-visible:-translate-y-1/);
    assert.match(SOURCE, /motion-reduce:transition-none/);
    assert.match(SOURCE, /motion-reduce:transform-none/);
  });

  it("holds the 3:2 frame and the sizes attribute together", () => {
    assert.match(SOURCE, /aspect-\[3\/2\]/);
    assert.ok(
      SOURCE.includes('"(min-width: 1024px) 380px, 72vw"'),
      "sizes must match §5 row 7",
    );
    assert.match(SOURCE, /w-\[72vw\] max-w-\[380px\][^"]*lg:w-\[380px\]/, "frame width must track sizes");
  });

  it("routes every image through the remote-image contract", () => {
    assert.match(SOURCE, /from "@\/components\/media\/remote-image"/);
    assert.ok(!/<img\b/.test(SOURCE), "a bare <img> bypasses resolveImageSrc");
    assert.ok(!/from "next\/image"/.test(SOURCE), "next/image directly would skip the fallback branch");
  });

  it("treats a missing photograph as a supported state", () => {
    assert.match(SOURCE, /src\?:\s*string \| null/, "src must be optional and nullable");
    assert.match(SOURCE, /fallbackLabel/);
  });

  it("keeps each caption inside its own figure", () => {
    assert.equal((SOURCE.match(/<figure/g) ?? []).length, 1, "one figure element, rendered per frame");
    assert.match(SOURCE, /<figcaption/);
    // The caption must be a sibling of the frame inside the same <figure>, so
    // it can never separate from its image at any width.
    const figure = SOURCE.slice(SOURCE.indexOf("<figure"), SOURCE.indexOf("</figure>"));
    assert.ok(figure.includes("<figcaption"), "the caption escaped its figure");
  });
});
