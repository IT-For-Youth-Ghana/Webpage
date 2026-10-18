import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, it } from "node:test";

import { findPlaceholderGradients } from "../../scripts/media-pairing.mjs";

/**
 * A gradient must never stand in for a photograph.
 *
 * This is the rule most likely to be broken by accident, because a gradient in
 * an empty media slot looks finished. It reads as a design decision, so it
 * survives review, and then it ships. The detector under test distinguishes it
 * from the scrims and washes that legitimately sit over real photographs.
 */
describe("placeholder gradient detector", () => {
  it("flags a gradient rendered in place of an image", () => {
    const source = `{cover ? (
      <Image src={cover} alt={title} fill />
    ) : (
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#174a82,#0c2d5a)]" />
    )}`;
    assert.equal(findPlaceholderGradients(source).length, 1);
  });

  it("flags one built from palette tokens just the same", () => {
    const source = `{src ? (<Image src={src} alt={alt} fill />) : (
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-primary-light),var(--color-bg-alt))]" aria-hidden="true" />
    )}`;
    assert.equal(findPlaceholderGradients(source).length, 1);
  });

  it("flags one whose stops happen to include transparency", () => {
    // Layering an rgba stop over an opaque base does not make it a scrim.
    const source = `{item.url ? (<Image src={item.url} alt="" fill />) : (
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(245,180,38,0.32),transparent_42%),linear-gradient(135deg,#174a82,#0c2d5a)]" />
    )}`;
    assert.equal(findPlaceholderGradients(source).length, 1);
  });

  it("ignores a scrim laid over a real photograph", () => {
    const source = `<Image src={hero} alt={alt} fill />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,39,0.38),rgba(7,20,39,0.58))]" aria-hidden="true" />`;
    assert.deepEqual(findPlaceholderGradients(source), []);
  });

  it("ignores a vignette that follows a JSX comment", () => {
    const source = `<Image src={hero} alt={alt} fill />
    {/* Edge vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_25%,rgba(5,25,52,0.32)_100%)]" />`;
    assert.deepEqual(findPlaceholderGradients(source), []);
  });

  it("ignores a section background behind live content", () => {
    const source = `<section className="bg-[linear-gradient(135deg,var(--color-primary-light)_0%,#ffffff_100%)] px-6 py-20">
      <p>Copy that sits on the gradient rather than being replaced by it.</p>
    </section>`;
    assert.deepEqual(findPlaceholderGradients(source), []);
  });
});

function sourceFiles(dir: string, out: string[] = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (extname(entry) === ".tsx") out.push(full);
  }
  return out;
}

describe("no gradient stands in for a photograph anywhere", () => {
  it("holds across every component and route", () => {
    const offenders: string[] = [];

    for (const file of [...sourceFiles("components"), ...sourceFiles("app")]) {
      for (const snippet of findPlaceholderGradients(readFileSync(file, "utf8"))) {
        offenders.push(`${file}\n      ${snippet}`);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      `gradients are standing in for photographs. Render MediaFallback instead:\n    ${offenders.join("\n    ")}`,
    );
  });
});
