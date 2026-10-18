import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { sitePageSchema } from "../utils/validators.ts";

/**
 * The write path and the read path of SitePage must describe the same record.
 *
 * A SitePage value survives a save only if BOTH of these hold:
 *
 *   1. lib/utils/validators.ts sitePageSchema declares the key, because
 *      z.object strips every key it does not declare.
 *   2. lib/cms/site-pages.ts mergeSitePage reads the key back, either through
 *      optionalStringFields or through an explicit asString(data.key) line.
 *
 * Neither file imports the other, so the two lists drifted silently and three
 * fields broke in two different ways: heroImageAlt failed (1) and was discarded
 * on submit while the admin reported success, heroVideoUrl and
 * heroVideoThumbnail failed (2) and were written to Firestore where no reader
 * would ever see them again.
 *
 * This test reads source rather than running Firebase, so it stays in the fast
 * deterministic lane beside lib/cms/coverage.test.ts.
 */

const SITE_PAGES = readFileSync("lib/cms/site-pages.ts", "utf8");

/** The keys mergeSitePage copies from Firestore through optionalStringFields. */
function readerOptionalStringFields(): string[] {
  const block = SITE_PAGES.match(/const optionalStringFields = \[([\s\S]*?)\] as const/);
  assert.ok(block, "could not find optionalStringFields in lib/cms/site-pages.ts");
  return [...block[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

/** The keys mergeSitePage assigns by hand, e.g. `title: asString(data.title) ?? ...`. */
function readerExplicitFields(): string[] {
  const body = SITE_PAGES.match(/function mergeSitePage\([\s\S]*?\n}/);
  assert.ok(body, "could not find mergeSitePage in lib/cms/site-pages.ts");
  return [...body[0].matchAll(/asString\(data\.([A-Za-z0-9_]+)\)/g)].map((match) => match[1]);
}

/**
 * Unwrap the Zod wrappers the schema uses (preprocess, optional, default) and
 * report whether the value that finally lands in Firestore is a string.
 */
function isStringField(schema: unknown): boolean {
  let node = schema as { _def?: { typeName?: string; schema?: unknown; innerType?: unknown } };

  for (let depth = 0; depth < 8; depth += 1) {
    const typeName = node?._def?.typeName;
    if (typeName === "ZodString") return true;
    if (typeName === "ZodEffects") node = node._def!.schema as typeof node;
    else if (typeName === "ZodOptional" || typeName === "ZodNullable" || typeName === "ZodDefault")
      node = node._def!.innerType as typeof node;
    else return false;
  }

  return false;
}

function schemaStringFields(): string[] {
  return Object.entries(sitePageSchema.shape)
    .filter(([, value]) => isStringField(value))
    .map(([key]) => key);
}

describe("SitePage write/read parity", () => {
  const schemaFields = schemaStringFields();
  const optional = readerOptionalStringFields();
  const explicit = readerExplicitFields();
  const readable = new Set([...optional, ...explicit]);

  it("parses both sides", () => {
    // Guards against a silently passing test: if either parse breaks, every
    // other assertion below becomes vacuous.
    assert.ok(schemaFields.length >= 20, `parsed only ${schemaFields.length} schema string fields`);
    assert.ok(optional.length >= 20, `parsed only ${optional.length} optionalStringFields entries`);
    assert.ok(explicit.length >= 5, `parsed only ${explicit.length} explicit mergeSitePage reads`);
  });

  it("every string field the schema accepts is read back by mergeSitePage", () => {
    // This is the heroVideoUrl / heroVideoThumbnail failure: valid on save,
    // stored in Firestore, invisible to every public page.
    const writeOnly = schemaFields.filter((field) => !readable.has(field));
    assert.deepEqual(
      writeOnly,
      [],
      `sitePageSchema accepts these but mergeSitePage never reads them back:\n  ${writeOnly.join("\n  ")}`,
    );
  });

  it("every field mergeSitePage reads is accepted by the schema", () => {
    // The mirror failure, and the heroImageAlt one: the reader expects a field
    // the validator strips, so the admin saves nothing and reports success.
    const unwritable = optional.filter((field) => !schemaFields.includes(field));
    assert.deepEqual(
      unwritable,
      [],
      `mergeSitePage reads these but sitePageSchema strips them on save:\n  ${unwritable.join("\n  ")}`,
    );
  });

  it("hero alt text survives a round trip", () => {
    // The specific regression. Before the fix this parsed to undefined.
    const parsed = sitePageSchema.parse({
      eyebrow: "Who We Are",
      title: "Who We Are",
      heroImage: "/images/hero.jpg",
      heroImageAlt: "Learners building a circuit together during a robotics session",
    });

    assert.equal(
      parsed.heroImageAlt,
      "Learners building a circuit together during a robotics session",
    );
    assert.ok(readable.has("heroImageAlt"), "mergeSitePage must read heroImageAlt back");
  });

  it("the shared template does not fall back to the page title for hero alt", () => {
    // types/content.ts:58-62 exists to stop exactly this: repeating the heading
    // a screen-reader user has already heard is worse than no alt at all.
    const template = readFileSync("components/shared/content-page.tsx", "utf8");
    assert.doesNotMatch(
      template,
      /heroImageAlt\s*\|\|\s*page\.title/,
      "content-page.tsx must not use the page title as hero alt text",
    );
  });
});
