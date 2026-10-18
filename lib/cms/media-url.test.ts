import assert from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { ALLOWED_REMOTE_IMAGE_HOSTS } from "../media/remote-image.ts";
import { MISSING_ALT_MESSAGE, describeMediaUrlProblem } from "./media-url.ts";

/**
 * The verdict a media URL gets, and the guarantee that there is exactly one of
 * it.
 *
 * The bug this locks down: the same function existed twice, once here and once
 * inside lib/utils/validators.ts. Two copies of a host allowlist is two
 * verdicts waiting to disagree, and the failure is silent in the worst
 * direction: the admin says "saved", the record persists, and the public page
 * throws inside next/image at request time on a visitor's request.
 */
describe("describeMediaUrlProblem", () => {
  it("accepts an empty value, because media is optional", () => {
    assert.equal(describeMediaUrlProblem(undefined), null);
    assert.equal(describeMediaUrlProblem(null), null);
    assert.equal(describeMediaUrlProblem("   "), null);
  });

  it("accepts a repository-relative path, which this app serves itself", () => {
    assert.equal(describeMediaUrlProblem("/images/randomPictures/graduation.jpg"), null);
  });

  it("rejects a protocol-relative URL, which is not a repository path", () => {
    // "//evil.example/x.jpg" starts with a slash but is a remote host, so the
    // leading-slash shortcut must not swallow it.
    assert.ok(describeMediaUrlProblem("//images.unsplash.com/photo-1"));
  });

  it("rejects anything that is not a URL at all", () => {
    assert.match(describeMediaUrlProblem("images.unsplash.com/photo") ?? "", /full https:\/\/ address/);
  });

  it("rejects http, because the site is served over https", () => {
    assert.match(describeMediaUrlProblem("http://images.unsplash.com/p.jpg") ?? "", /https/);
  });

  it("accepts every host next/image is configured for", () => {
    for (const host of ALLOWED_REMOTE_IMAGE_HOSTS) {
      assert.equal(
        describeMediaUrlProblem(`https://${host}/photo-1.jpg`),
        null,
        `${host} is in next.config.mjs and must pass validation`,
      );
    }
  });

  it("names the offending host and the approved ones when it refuses", () => {
    const problem = describeMediaUrlProblem("https://cdn.example.com/photo.jpg") ?? "";
    assert.match(problem, /cdn\.example\.com/, "the editor must be told which host failed");
    for (const host of ALLOWED_REMOTE_IMAGE_HOSTS) {
      assert.ok(problem.includes(host), `the message must list ${host} as an alternative`);
    }
  });

  it("is not case-sensitive about the host, because URL parsing lowercases it", () => {
    assert.equal(describeMediaUrlProblem("https://IMAGES.unsplash.com/photo-1.jpg"), null);
  });
});

describe("one implementation, one verdict", () => {
  /** Application source only: the test files below are allowed to say the name. */
  const SOURCES = globSync("{app,components,lib,types}/**/*.{ts,tsx}").filter(
    (file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"),
  );

  it("declares describeMediaUrlProblem exactly once", () => {
    const declarations = SOURCES.filter((file) =>
      /function describeMediaUrlProblem\b/.test(readFileSync(file, "utf8")),
    );

    assert.deepEqual(
      declarations,
      ["lib/cms/media-url.ts"],
      "the verdict lives in lib/cms/media-url.ts. Import it; do not write a second copy.",
    );
  });

  it("declares the missing-alt sentence exactly once", () => {
    const fragment = "invisible to a screen-reader user";
    const declarations = SOURCES.filter((file) =>
      readFileSync(file, "utf8").includes(fragment),
    );

    assert.deepEqual(
      declarations,
      ["lib/cms/media-url.ts"],
      "MISSING_ALT_MESSAGE is the one wording. Import it rather than retyping the sentence.",
    );
    assert.match(MISSING_ALT_MESSAGE, /screen-reader/);
  });

  it("keeps the save boundary on the shared verdict", () => {
    const validators = readFileSync("lib/utils/validators.ts", "utf8");
    assert.match(
      validators,
      /import \{[^}]*describeMediaUrlProblem[^}]*\} from "\.\.\/cms\/media-url\.ts"/,
      "validators.ts must import the verdict, not re-derive it from the allowlist",
    );
    assert.ok(
      !validators.includes("ALLOWED_REMOTE_IMAGE_HOSTS"),
      "only lib/cms/media-url.ts reads the host allowlist",
    );
  });
});
