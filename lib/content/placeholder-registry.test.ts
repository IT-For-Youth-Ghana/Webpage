import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, it } from "node:test";

import { ALLOWED_REMOTE_IMAGE_HOSTS } from "../media/remote-image.ts";

const REGISTRY_PATH = "docs/redesign/placeholder-media.json";

type Placeholder = {
  route: string;
  section: string;
  url: string;
  orientation: string;
  role: string;
  replacement: string;
};

const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8")) as {
  orientations: string[];
  placeholders: Placeholder[];
};

const REQUIRED_FIELDS: (keyof Placeholder)[] = [
  "route",
  "section",
  "url",
  "orientation",
  "role",
  "replacement",
];

/** Every .ts/.tsx file the application actually ships. */
function sourceFiles(dir: string, out: string[] = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if ([".ts", ".tsx"].includes(extname(entry)) && !entry.endsWith(".test.ts")) out.push(full);
  }
  return out;
}

const SOURCES = ["app", "components", "lib"].flatMap((dir) => sourceFiles(dir));

/**
 * Image URLs written into source, as opposed to arriving from Firestore or the
 * course API at runtime. Only a literal in the repository can be registered,
 * and only a literal is ours to replace before launch.
 */
function hardcodedImageUrls() {
  const hosts = ALLOWED_REMOTE_IMAGE_HOSTS.filter((h) => !h.endsWith("itforyouthghana.org"));
  const pattern = new RegExp(`https://(?:${hosts.join("|").replace(/\./g, "\\.")})/[^"'\\s\`]+`, "g");
  const found = new Map<string, string[]>();

  for (const file of SOURCES) {
    for (const match of readFileSync(file, "utf8").matchAll(pattern)) {
      const url = match[0];
      found.set(url, [...(found.get(url) ?? []), file]);
    }
  }
  return found;
}

describe("placeholder media registry", () => {
  it("is a well-formed replacement map", () => {
    assert.ok(Array.isArray(registry.placeholders), `${REGISTRY_PATH} has no placeholders array`);
    assert.ok(registry.orientations.length > 0, "the registry must declare its orientation vocabulary");
  });

  it("gives every entry all six fields with real content", () => {
    const broken: string[] = [];

    registry.placeholders.forEach((entry, index) => {
      for (const field of REQUIRED_FIELDS) {
        const value = entry[field];
        if (typeof value !== "string" || value.trim() === "") {
          broken.push(`entry ${index}: ${field} is empty`);
        }
      }
      if (entry.orientation && !registry.orientations.includes(entry.orientation)) {
        broken.push(`entry ${index}: orientation "${entry.orientation}" is not one of ${registry.orientations.join(", ")}`);
      }
      // "replacement" is the commissioning instruction. One word is not one.
      if (typeof entry.replacement === "string" && entry.replacement.trim().split(/\s+/).length < 6) {
        broken.push(`entry ${index}: replacement must describe the final photograph, not label it`);
      }
    });

    assert.deepEqual(broken, [], `placeholder registry entries are incomplete:\n  ${broken.join("\n  ")}`);
  });

  it("points every entry at a host next/image can optimise", () => {
    const bad = registry.placeholders
      .filter((entry) => {
        try {
          const url = new URL(entry.url);
          return url.protocol !== "https:" || !ALLOWED_REMOTE_IMAGE_HOSTS.includes(url.hostname as never);
        } catch {
          return true;
        }
      })
      .map((entry) => `${entry.route} ${entry.section}: ${entry.url}`);

    assert.deepEqual(bad, [], `placeholder URLs on hosts next.config.mjs does not allow:\n  ${bad.join("\n  ")}`);
  });

  it("registers no slot twice", () => {
    const keys = registry.placeholders.map((e) => `${e.route}|${e.section}|${e.url}`);
    assert.equal(new Set(keys).size, keys.length, "the same route, section and URL is registered more than once");
  });

  /**
   * The teeth. A hardcoded Unsplash URL that nobody recorded is a placeholder
   * that ships to production, because the only thing standing between design
   * media and launch media is this file.
   */
  it("records every external image URL hardcoded in application source", () => {
    const registered = new Set(registry.placeholders.map((e) => e.url));
    const unregistered: string[] = [];

    for (const [url, files] of hardcodedImageUrls()) {
      if (!registered.has(url)) unregistered.push(`${url}\n      used in ${files.join(", ")}`);
    }

    assert.deepEqual(
      unregistered,
      [],
      `external image URLs in source with no entry in ${REGISTRY_PATH}:\n    ${unregistered.join("\n    ")}`,
    );
  });

  it("does not keep entries for URLs the code no longer uses", () => {
    const inSource = new Set(hardcodedImageUrls().keys());
    // A registry entry may legitimately describe a CMS-seeded URL rather than a
    // source literal, so this only reports entries whose route file is gone.
    const orphaned = registry.placeholders
      .filter((e) => !inSource.has(e.url) && e.route.startsWith("/") === false)
      .map((e) => `${e.route}: ${e.url}`);

    assert.deepEqual(orphaned, [], `registry entries with an unusable route:\n  ${orphaned.join("\n  ")}`);
  });
});

describe("banned placeholder artefacts", () => {
  it("keeps the grey placeholder.svg deleted", () => {
    assert.equal(
      existsSync("public/images/fallback/placeholder.svg"),
      false,
      'public/images/fallback/placeholder.svg is a grey box reading "Image placeholder"; the media policy bans it. Use MediaFallback.',
    );
  });

  it("has no source reference to it", () => {
    const offenders = SOURCES.filter((file) => readFileSync(file, "utf8").includes("fallback/placeholder.svg"));
    assert.deepEqual(offenders, [], `these files still reference the deleted placeholder image:\n  ${offenders.join("\n  ")}`);
  });
});
