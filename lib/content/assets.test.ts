import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

/**
 * Comments legitimately contain example paths, such as the note in site-config
 * reading `logo: "/images/partners/name.svg"` once assets are available. Strip
 * them so a documented placeholder is not reported as a broken reference.
 */
const stripComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/[^\n]*/g, "$1");

/**
 * Every local image path in the content layer must resolve to a file on disk.
 *
 * The Operations Department hero pointed at groupstudents.jpg, which has never
 * existed; the page rendered a broken frame with no error anywhere in the build.
 * A missing asset is invisible until someone loads the page, so it gets a test.
 */
describe("content asset references", () => {
  const files = readdirSync("lib/content").filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));

  it("resolves every local image path to a real file", () => {
    const broken: string[] = [];

    for (const file of files) {
      const source = stripComments(readFileSync(join("lib/content", file), "utf8"));
      for (const match of source.matchAll(/"(\/images\/[^"]+)"/g)) {
        const path = match[1];
        if (!existsSync(join("public", path))) broken.push(`${file}: ${path}`);
      }
    }

    assert.deepEqual(broken, [], `content references images that do not exist:\n  ${broken.join("\n  ")}`);
  });

  it("resolves every local report and video path too", () => {
    const broken: string[] = [];

    for (const file of files) {
      const source = stripComments(readFileSync(join("lib/content", file), "utf8"));
      for (const match of source.matchAll(/"(\/(?:reports|videos)\/[^"]+)"/g)) {
        const path = match[1];
        if (!existsSync(join("public", path))) broken.push(`${file}: ${path}`);
      }
    }

    assert.deepEqual(broken, [], `content references files that do not exist:\n  ${broken.join("\n  ")}`);
  });
});
