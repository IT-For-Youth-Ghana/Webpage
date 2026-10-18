import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isCssColor, safeCssColor } from "./css-color.ts";

const FALLBACK = "#1E72BA";

describe("isCssColor", () => {
  it("accepts the notations the content model actually uses", () => {
    for (const value of [
      "#D70B52",
      "#fff",
      "#FFFF",
      "#1E72BAFF",
      "rgb(30,114,186)",
      "rgba(10,15,40,0.88)",
      "rgba( 5 , 25 , 15 , 0.40 )",
      "hsl(210,72%,42%)",
      "hsla(210deg,72%,42%,0.5)",
    ]) {
      assert.equal(isCssColor(value), true, `should accept ${value}`);
    }
  });

  it("rejects malformed and non-string values", () => {
    for (const value of [
      "",
      "   ",
      "#12",
      "#12345",
      "#GGGGGG",
      "blue",
      "transparent",
      "rgb(1,2)",
      "url(https://example.com/x.png)",
      "var(--color-accent)",
      undefined,
      null,
      42,
      {},
      [],
    ]) {
      assert.equal(isCssColor(value), false, `should reject ${JSON.stringify(value)}`);
    }
  });

  it("rejects attempts to smuggle extra declarations into the value", () => {
    for (const value of [
      "#fff; background: url(x)",
      "red } body { display:none",
      "rgb(0,0,0) !important",
      "#fff\n;color:red",
    ]) {
      assert.equal(isCssColor(value), false, `should reject ${JSON.stringify(value)}`);
    }
  });
});

describe("safeCssColor", () => {
  it("passes a usable colour through, trimmed", () => {
    assert.equal(safeCssColor("  #D70B52  ", FALLBACK), "#D70B52");
    assert.equal(safeCssColor("rgba(10,15,40,0.88)", FALLBACK), "rgba(10,15,40,0.88)");
  });

  it("falls back rather than emitting a broken declaration", () => {
    // heroSlides is validated as z.array(z.unknown()), so these all reach the
    // renderer in practice.
    for (const value of [undefined, null, "", "  ", "not-a-colour", 0, false, {}]) {
      assert.equal(safeCssColor(value, FALLBACK), FALLBACK);
    }
  });
});
