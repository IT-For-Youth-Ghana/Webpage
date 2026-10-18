import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { splitHeading } from "./split-heading.ts";

describe("splitHeading", () => {
  it("leaves one- and two-word headings whole", () => {
    assert.deepEqual(splitHeading("Apply"), { first: "Apply", second: "" });
    assert.deepEqual(splitHeading("Apply now"), { first: "Apply now", second: "" });
  });

  it("splits just past the midpoint so the lead clause carries the weight", () => {
    assert.deepEqual(splitHeading("one two three four"), {
      first: "one two three",
      second: "four",
    });
  });

  it("splits the real seeded hero headings at the documented point", () => {
    // Asserted against the rule (ceil(words * 0.52)) rather than hand-typed
    // strings, so the test checks the contract instead of a transcription.
    const splitPoint = (heading: string) =>
      Math.max(1, Math.ceil(heading.trim().split(/\s+/).length * 0.52));

    for (const heading of [
      "Build practical digital skills. Gain confidence. Shape your future.",
      "Invest in Ghana's next generation of digital talent.",
      "Train your teams. Sponsor talent. Hire job-ready graduates.",
    ]) {
      const words = heading.trim().split(/\s+/);
      const point = splitPoint(heading);
      assert.deepEqual(splitHeading(heading), {
        first: words.slice(0, point).join(" "),
        second: words.slice(point).join(" "),
      });
    }
  });

  it("puts the majority of words in the lead clause", () => {
    // The trailing clause is styled lighter, so the lead must carry the
    // headline. This is the property the 0.52 factor exists to guarantee.
    for (const count of [3, 4, 5, 6, 7, 8, 9, 12, 17, 25]) {
      const heading = Array.from({ length: count }, (_, i) => `w${i}`).join(" ");
      const { first, second } = splitHeading(heading);
      const lead = first.split(" ").length;
      const tail = second.split(" ").length;
      assert.ok(lead >= tail, `lead ${lead} < tail ${tail} at ${count} words`);
      assert.equal(lead + tail, count);
    }
  });

  it("collapses irregular whitespace rather than emitting empty words", () => {
    assert.deepEqual(splitHeading("  alpha   beta \n gamma  delta  "), {
      first: "alpha beta gamma",
      second: "delta",
    });
  });

  it("always produces a non-empty lead clause", () => {
    for (const words of [3, 4, 5, 8, 13, 21]) {
      const heading = Array.from({ length: words }, (_, i) => `w${i}`).join(" ");
      const { first, second } = splitHeading(heading);
      assert.ok(first.length > 0, `empty lead for ${words} words`);
      assert.ok(second.length > 0, `empty tail for ${words} words`);
      assert.equal(`${first} ${second}`, heading, `lossy split for ${words} words`);
    }
  });
});
