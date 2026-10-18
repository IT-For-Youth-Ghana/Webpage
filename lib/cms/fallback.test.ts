import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { resolveCmsArray, resolveCmsValue } from "./fallback.ts";

const SEED = [{ id: "seed-1" }, { id: "seed-2" }];

describe("resolveCmsArray", () => {
  it("uses Firestore content when there is any", () => {
    const live = [{ id: "live-1" }];
    assert.equal(resolveCmsArray(live, SEED), live);
  });

  it("falls back when the field is missing", () => {
    // This is the regression. The homepage document had no joinCtaCards field,
    // the old code turned that into [], Array.isArray([]) passed, and the
    // join-the-movement cards silently disappeared from the live page.
    assert.equal(resolveCmsArray(undefined, SEED), SEED);
    assert.equal(resolveCmsArray(null, SEED), SEED);
  });

  it("falls back on an empty array", () => {
    // Empty means unconfigured. Sections are hidden with active: false on the
    // item, never by emptying the array.
    assert.equal(resolveCmsArray([], SEED), SEED);
  });

  it("falls back when the field is not an array at all", () => {
    for (const bad of [{}, "", "text", 0, 42, true, false]) {
      assert.equal(resolveCmsArray(bad, SEED), SEED, `should reject ${JSON.stringify(bad)}`);
    }
  });

  it("does not confuse a single falsy element with an empty array", () => {
    const live = [0];
    assert.equal(resolveCmsArray(live, SEED), live);
  });
});

describe("resolveCmsValue", () => {
  it("prefers live content and falls back only on null or undefined", () => {
    assert.equal(resolveCmsValue({ a: 1 }, { a: 9 }).a, 1);
    assert.equal(resolveCmsValue(undefined, SEED), SEED);
    assert.equal(resolveCmsValue(null, SEED), SEED);
  });
});

describe("the homepage readers use the helper", () => {
  it("has no inline '?? []' fallback left, which is what caused the bug", () => {
    const source = readFileSync("lib/cms/homepage.ts", "utf8");
    assert.ok(
      !/getDocField<unknown\[\]>\([^)]*\)\s*\?\?\s*\[\]/.test(source),
      "an inline `?? []` makes Array.isArray pass on the empty case and skips the seed",
    );
  });

  it("routes every array field through resolveCmsArray", () => {
    const source = readFileSync("lib/cms/homepage.ts", "utf8");
    const arrayReads = source.match(/getDocField<unknown\[\]>/g) ?? [];
    const resolved = source.match(/resolveCmsArray</g) ?? [];
    assert.equal(
      arrayReads.length,
      resolved.length,
      `${arrayReads.length} array field reads but ${resolved.length} resolveCmsArray calls`,
    );
  });
});
