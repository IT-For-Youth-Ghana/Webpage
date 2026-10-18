import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { ALLOWED_REMOTE_IMAGE_HOSTS, isExternalImageSrc, resolveImageSrc } from "./remote-image.ts";

describe("resolveImageSrc", () => {
  it("passes a repository-relative path through", () => {
    assert.equal(resolveImageSrc("/images/people/portrait.jpg"), "/images/people/portrait.jpg");
  });

  it("passes an allowed remote host through unchanged", () => {
    const src = "https://images.unsplash.com/photo-123?auto=format&w=1600";
    assert.equal(resolveImageSrc(src), src);
  });

  it("returns null for a host next.config does not list", () => {
    assert.equal(resolveImageSrc("https://example.com/photo.jpg"), null);
  });

  it("returns null for plain http even on an allowed host", () => {
    // next/image will not optimise it and the mixed-content warning is real.
    assert.equal(resolveImageSrc("http://images.unsplash.com/photo-123"), null);
  });

  it("returns null for a protocol-relative URL", () => {
    // "//host/path" starts with a slash but is not served by this app.
    assert.equal(resolveImageSrc("//images.unsplash.com/photo-123"), null);
  });

  it("returns null rather than throwing on an unparseable value", () => {
    for (const value of ["", "   ", "not a url", undefined, null]) {
      assert.equal(resolveImageSrc(value), null);
    }
  });

  it("trims incidental whitespace, which CMS paste routinely introduces", () => {
    assert.equal(resolveImageSrc("  /images/logo/mark.svg  "), "/images/logo/mark.svg");
  });
});

describe("isExternalImageSrc", () => {
  it("separates repository paths from remote URLs", () => {
    assert.equal(isExternalImageSrc("/images/a.jpg"), false);
    assert.equal(isExternalImageSrc("https://images.unsplash.com/photo-1"), true);
    assert.equal(isExternalImageSrc(null), false);
  });
});

/**
 * The allowlist and next.config.mjs must agree.
 *
 * They are two hand-maintained lists describing one fact. If the module lists a
 * host the config does not, next/image throws at request time for a visitor and
 * for nobody else. If the config lists a host the module does not, a perfectly
 * valid CMS image silently degrades to the typographic stand-in and reads as
 * missing content. Neither failure surfaces in the build.
 */
describe("remote host allowlist", () => {
  it("matches next.config.mjs remotePatterns exactly", () => {
    // Read rather than import: next.config.mjs is untyped JavaScript, and
    // evaluating it in a test buys nothing that parsing the literal does not.
    const config = readFileSync("next.config.mjs", "utf8");
    const patterns = config.slice(config.indexOf("remotePatterns"), config.indexOf("async redirects"));
    const configured = [...patterns.matchAll(/hostname:\s*"([^"]+)"/g)].map((m) => m[1]);

    assert.ok(configured.length > 0, "parsed no hostnames out of next.config.mjs remotePatterns");

    assert.deepEqual(
      [...configured].sort(),
      [...ALLOWED_REMOTE_IMAGE_HOSTS].sort(),
      "lib/media/remote-image.ts and next.config.mjs disagree about which image hosts are allowed",
    );
  });

  it("allows the Unsplash host the placeholder policy depends on", () => {
    assert.ok(ALLOWED_REMOTE_IMAGE_HOSTS.includes("images.unsplash.com"));
  });
});
