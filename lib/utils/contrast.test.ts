import assert from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { contrastRatio, meetsAA, relativeLuminance } from "./contrast.ts";

/** Verified brand values from tailwind.config.ts. */
const TOKEN = {
  white: "#FFFFFF",
  ink: "#1A1A1A",
  muted: "#5C6672",
  accent: "#D70B52",
  accentDark: "#B00944",
  accentOnDark: "#FF5C86",
  primary: "#1E72BA",
  primaryDark: "#0152BE",
  deep: "#142850",
  mist: "#E8F1FA",
  warm: "#FBE7EF",
} as const;

describe("contrastRatio", () => {
  it("matches the WCAG reference extremes", () => {
    assert.equal(Number(contrastRatio("#000000", "#FFFFFF").toFixed(2)), 21);
    assert.equal(contrastRatio("#FFFFFF", "#FFFFFF"), 1);
  });

  it("is symmetric", () => {
    assert.equal(
      contrastRatio(TOKEN.accent, TOKEN.white),
      contrastRatio(TOKEN.white, TOKEN.accent),
    );
  });

  it("accepts shorthand hex", () => {
    assert.equal(relativeLuminance("#fff"), relativeLuminance("#ffffff"));
  });

  it("rejects values that are not hex colours", () => {
    for (const bad of ["", "#", "blue", "rgb(0,0,0)", "#12345"]) {
      assert.throws(() => relativeLuminance(bad), /not a hex colour/);
    }
  });
});

describe("brand token pairings meet WCAG AA", () => {
  it("passes for every pairing the redesign actually uses", () => {
    const pairings: Array<[string, string, string, "body" | "large"]> = [
      ["white on accent", TOKEN.white, TOKEN.accent, "body"],
      ["white on accent-dark", TOKEN.white, TOKEN.accentDark, "body"],
      ["white on primary", TOKEN.white, TOKEN.primary, "body"],
      ["white on primary-dark", TOKEN.white, TOKEN.primaryDark, "body"],
      ["white on deep", TOKEN.white, TOKEN.deep, "body"],
      ["ink on white", TOKEN.ink, TOKEN.white, "body"],
      ["ink on mist", TOKEN.ink, TOKEN.mist, "body"],
      ["ink on warm", TOKEN.ink, TOKEN.warm, "body"],
      ["muted on white", TOKEN.muted, TOKEN.white, "body"],
      ["muted on mist", TOKEN.muted, TOKEN.mist, "body"],
    ];

    for (const [name, fg, bg, size] of pairings) {
      const ratio = contrastRatio(fg, bg);
      assert.ok(
        meetsAA(fg, bg, size),
        `${name} is ${ratio.toFixed(2)}:1, below AA for ${size} text`,
      );
    }
  });

  it("records why ink on accent is banned", () => {
    // 3.36:1. It reads fine at a glance, which is exactly why it survived in
    // fifteen places, and why this is a test rather than a review note.
    const ratio = contrastRatio(TOKEN.ink, TOKEN.accent);
    assert.ok(ratio < 4.5, "if this ever passes AA, the ban can be lifted");
    assert.equal(Number(ratio.toFixed(2)), 3.36);
  });

  it("never pairs ink text with an accent background in any component", () => {
    // The pairing is only wrong when both land in the same class string, so the
    // check is per class string rather than per file.
    const offenders: string[] = [];

    for (const file of globSync("{components,app}/**/*.tsx")) {
      for (const literal of readFileSync(file, "utf8").match(/"[^"\n]*"/g) ?? []) {
        if (literal.includes("bg-brand-accent") && literal.includes("text-brand-ink")) {
          offenders.push(file);
        }
      }
    }

    assert.deepEqual(
      offenders,
      [],
      `ink on accent is 3.36:1 and fails AA; use text-white in ${offenders.join(", ")}`,
    );
  });
});

/**
 * Composite an alpha colour over an opaque one, the way the browser does.
 *
 * The hero's copy panel is a crimson radial gradient at 22% over navy, so the
 * colour the headline actually sits on is neither token. Checking the headline
 * against the navy alone would pass a pairing that does not exist on screen.
 */
function over(foreground: string, background: string, alpha: number) {
  const channels = (hex: string) =>
    [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  const [fr, fg, fb] = channels(foreground);
  const [br, bg, bb] = channels(background);
  const mix = (f: number, b: number) =>
    Math.round(f * alpha + b * (1 - alpha))
      .toString(16)
      .padStart(2, "0");

  return `#${mix(fr, br)}${mix(fg, bg)}${mix(fb, bb)}`;
}

describe("the accent has a second voice on dark panels", () => {
  /** tailwind.config.ts backgroundImage["hero-copy"]: crimson at 22% over navy. */
  const HERO_COPY_PANEL = over(TOKEN.accent, TOKEN.deep, 0.22);

  it("records why the logo crimson cannot carry text on navy", () => {
    const ratio = contrastRatio(TOKEN.accent, TOKEN.deep);
    assert.equal(Number(ratio.toFixed(2)), 2.8);
    assert.ok(ratio < 4.5, "if this ever passes AA, brand-accent-on-dark can go");
  });

  it("clears AA on the navy panel and on the hero's crimson glow", () => {
    for (const [name, background] of [
      ["brand-deep", TOKEN.deep],
      ["the hero copy panel", HERO_COPY_PANEL],
    ] as const) {
      const ratio = contrastRatio(TOKEN.accentOnDark, background);
      assert.ok(
        meetsAA(TOKEN.accentOnDark, background, "body"),
        `accent-on-dark is ${ratio.toFixed(2)}:1 over ${name}, below AA`,
      );
    }
  });

  it("is unusable on light ground, so no component may put it there", () => {
    // 2.95:1 on white. The tint exists to be legible on navy; the same class on
    // a paper section is the failure this token was introduced to fix, mirrored.
    assert.ok(contrastRatio(TOKEN.accentOnDark, TOKEN.white) < 4.5);

    const lightGrounds = ["bg-white", "bg-brand-mist", "bg-brand-warm", "bg-brand-background"];
    const offenders: string[] = [];

    for (const file of globSync("{components,app}/**/*.tsx")) {
      for (const literal of readFileSync(file, "utf8").match(/"[^"\n]*"/g) ?? []) {
        if (!literal.includes("brand-accent-on-dark")) continue;
        if (lightGrounds.some((ground) => literal.includes(ground))) offenders.push(file);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      `accent-on-dark on a light ground is 2.95:1 in ${offenders.join(", ")}; use text-brand-accent`,
    );
  });
});
