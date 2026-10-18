#!/usr/bin/env node
/**
 * Deterministic checks for the hero capsule prototype.
 *
 * The capsule's whole premise is that the lens circle and the capsule's end
 * arc are the SAME arc, so the silhouette has no seam. That is an arithmetic
 * claim, so it gets checked by arithmetic rather than by looking at it.
 *
 * Run: node docs/design_iu_examples/verify-hero-capsule-prototype.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = resolve(here, "hero-capsule-slideshow-prototype.html");
const html = readFileSync(file, "utf8");

const failures = [];
const passes = [];
const check = (name, ok, detail = "") => {
  (ok ? passes : failures).push(detail ? `${name} — ${detail}` : name);
};

/* ---------------------------------------------------------------- geometry */

/**
 * CSS border-radius corner scaling, per CSS Backgrounds 3 section 5.5.
 *
 * This function previously scaled each corner independently, which is NOT what
 * browsers do and is why a broken shape passed these checks. The spec computes
 * ONE factor f = min(Li / Si) across all four sides, where Li is a side's length
 * and Si the sum of its two radii, and if f < 1 every radius is multiplied by f.
 *
 * The consequence in practice: putting 999px on the trailing corners of a
 * 1180x460 shell drove f to 0.23, which shrank the 230px leading corners to
 * 53px and left only the trailing end round. The capsule rendered mirrored.
 */
function resolveRadii({ w, h, tl, tr, br, bl }) {
  const sides = [
    [w, tl + tr], // top
    [h, tr + br], // right
    [w, br + bl], // bottom
    [h, tl + bl], // left
  ];

  let f = 1;
  for (const [length, sum] of sides) {
    if (sum > 0) f = Math.min(f, length / sum);
  }

  if (f >= 1) return { tl, tr, br, bl, scaled: false };
  return { tl: tl * f, tr: tr * f, br: br * f, bl: bl * f, scaled: true };
}

const PANEL = 24; // --radius-panel, 1.5rem

const BREAKPOINTS = [
  // label,            capsuleH, capsuleW, layout
  ["desktop >1180px",       460, 1180, "row"],
  ["laptop  <=1180px",      400, 1100, "row"],
  ["tablet  <=1000px",      340,  960, "row"],
  ["mobile  <=820px @440",  440,  440, "stack"],
  ["mobile  <=820px @360",  328,  328, "stack"],
];

for (const [label, capsuleH, capsuleW, layout] of BREAKPOINTS) {
  if (layout === "row") {
    // Declared: calc(H/2) PANEL PANEL calc(H/2). The lens is a centred square
    // of side H, so its radius is H/2 and it must equal the LEADING corners.
    const lensRadius = capsuleH / 2;
    const r = resolveRadii({
      w: capsuleW,
      h: capsuleH,
      tl: capsuleH / 2,
      tr: PANEL,
      br: PANEL,
      bl: capsuleH / 2,
    });

    check(
      `[${label}] nothing scaled down`,
      !r.scaled,
      r.scaled ? "a side overflowed, so every radius shrank" : "f = 1",
    );
    check(
      `[${label}] leading arc == lens arc`,
      Math.abs(r.tl - lensRadius) < 0.01 && Math.abs(r.bl - lensRadius) < 0.01,
      `lens r=${lensRadius}  tl=${r.tl.toFixed(1)}  bl=${r.bl.toFixed(1)}`,
    );
    check(
      `[${label}] the ROUND end is the LEADING end`,
      r.tl > r.tr && r.bl > r.br,
      `leading ${r.tl.toFixed(1)} vs trailing ${r.tr.toFixed(1)}`,
    );
    check(
      `[${label}] trailing corners keep the panel radius`,
      Math.abs(r.tr - PANEL) < 0.01,
      `tr=${r.tr.toFixed(1)}`,
    );

    const contentW = capsuleW - capsuleH;
    check(
      `[${label}] text column >= 460px`,
      contentW >= 460,
      `${contentW}px available`,
    );
  } else {
    // Stacked: the lens is the leading lobe at the top, full capsule width.
    // Declared: calc(W/2) calc(W/2) PANEL PANEL.
    const lensRadius = capsuleW / 2;
    const r = resolveRadii({
      w: capsuleW,
      h: capsuleH,
      tl: capsuleW / 2,
      tr: capsuleW / 2,
      br: PANEL,
      bl: PANEL,
    });

    check(`[${label}] nothing scaled down`, !r.scaled);
    check(
      `[${label}] leading arc == lens arc`,
      Math.abs(r.tl - lensRadius) < 0.01,
      `lens r=${lensRadius}  tl=${r.tl.toFixed(1)}`,
    );
    check(
      `[${label}] trailing corners keep the panel radius`,
      Math.abs(r.br - PANEL) < 0.01,
      `br=${r.br.toFixed(1)}`,
    );
  }
}

/* ------------------------------------------- the shipped hero, sized for real */

// --capsule-h = min(100svh - 2i, 100vw - 2i - 460)
function heroCapsuleH(vw, vh) {
  const inset = Math.min(24, Math.max(10, vw * 0.016));
  return { h: Math.min(vh - 2 * inset, vw - 2 * inset - 460), inset };
}

for (const [label, vw, vh] of [
  ["1920x1080", 1920, 1080],
  ["1680x1050", 1680, 1050],
  ["1440x900", 1440, 900],
  ["1366x768", 1366, 768],
  ["1280x800", 1280, 800],
  ["1280x1024", 1280, 1024],
  ["1024x768", 1024, 768],
]) {
  const { h, inset } = heroCapsuleH(vw, vh);
  const w = vw - 2 * inset;
  const r = resolveRadii({ w, h, tl: h / 2, tr: PANEL, br: PANEL, bl: h / 2 });

  check(
    `[hero ${label}] leading arc == lens arc, unscaled`,
    !r.scaled && Math.abs(r.tl - h / 2) < 0.01,
    `capsule ${Math.round(w)}x${Math.round(h)}, leading r=${r.tl.toFixed(0)}`,
  );
  check(
    `[hero ${label}] text column >= 460px`,
    w - h >= 459.9,
    `${Math.round(w - h)}px`,
  );
  check(
    `[hero ${label}] capsule fills the hero when height-bound`,
    h <= vh - 2 * inset + 0.01,
    h === vh - 2 * inset ? "height-bound, fills" : `width-bound, ${Math.round(vh - 2 * inset - h)}px slack`,
  );
}

/* ------------------------------------------------------------ declarations */

check(
  "leading end radius is derived from --capsule-h",
  /border-radius:\s*calc\(var\(--capsule-h[^)]*\)\s*\/\s*2\)/.test(html),
);
check(
  "lens is a centred square, never stretched",
  /\.capsule__media\{[^}]*align-self:center/s.test(html) &&
    !/\.capsule__media\{[^}]*align-self:stretch/s.test(html),
);
check(
  "invisible join is a mask, not a colour-matched overlay",
  /mask-image:linear-gradient/.test(html),
);
check(
  "mask is prefixed for WebKit",
  (html.match(/-webkit-mask-image/g) || []).length >= 2,
);

/* ------------------------------------------------- brief's hard constraints */

check("no lucide / icon library import", !/lucide/i.test(html.replace(/no lucide/gi, "")));
check("no bullet lists in rendered content", !/<\/li>|<ul[\s>]|<ol[\s>]/.test(html));
check(
  "no var() inside SVG presentation attributes",
  !/(?:stroke|fill|stop-color)="var\(/.test(html),
);
check("prefers-reduced-motion block present", /@media\s*\(prefers-reduced-motion:reduce\)/.test(html));
check(
  "autoplay does not start under reduced motion",
  /function canAutoplay\(\)\{\s*return\s*!reduceMotion/.test(html),
);
check("keyboard pause control exists", /data-toggle\b/.test(html) && /aria-pressed/.test(html));
check(
  "arrow keys ignore text-entry targets",
  /isTypingTarget\(event\.target\)\)\s*return/.test(html),
);
check("pointer flourishes disabled below 820px", /@media\s*\(max-width:820px\)/.test(html));
check("live region announces slide changes", /aria-live="polite"/.test(html));
check("every control has an accessible name", (html.match(/aria-label="/g) || []).length >= 7);
check("skip link present", /class="skip-link"/.test(html));

/* --------------------------------------------------- preserved behaviours */

for (const [name, re] of [
  ["6s autoplay interval", /var INTERVAL = 6000;/],
  ["progress indicator", /paintProgress/],
  ["pause on hover", /mouseenter[\s\S]{0,80}stopTimer/],
  ["arrow key navigation", /ArrowLeft[\s\S]{0,120}ArrowRight/],
  ["touch swipe", /touchstart[\s\S]*touchend/],
  ["per-slide overlayFrom/overlayTo", /overlayFrom[\s\S]*overlayTo/],
  ["primary + secondary CTA pair", /cta:\{[\s\S]*primary[\s\S]*secondary/],
  ["splitHeading helper", /function splitHeading/],
  ["blurred background duplicate", /stage__layer img\{[^}]*filter:blur/s],
]) {
  check(`preserved: ${name}`, re.test(html));
}

/* --------------------------------------------------------- token fidelity */

const TOKENS = {
  "--color-primary": "#1E72BA",
  "--color-primary-dark": "#0152BE",
  "--color-primary-light": "#E8F1FA",
  "--color-accent": "#D70B52",
  "--color-accent-dark": "#B00944",
  "--color-text": "#1A1A1A",
  "--color-text-muted": "#5C6672",
  "--color-border": "#D8E5F2",
  "--brand-navy": "#142850",
  "--brand-warm": "#FBE7EF",
};
for (const [token, value] of Object.entries(TOKENS)) {
  check(`token ${token} = ${value}`, html.includes(`${token}:${value}`));
}

/* ------------------------------------------------------------ asset paths */

for (const src of new Set([...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]))) {
  check(`asset exists: ${src}`, existsSync(resolve(here, src)));
}

/* ---------------------------------------------------------------- report */

console.log(`\n  ${passes.length} passed, ${failures.length} failed\n`);
if (failures.length) {
  for (const f of failures) console.log(`  FAIL  ${f}`);
  console.log("");
  process.exit(1);
}
for (const p of passes) console.log(`  ok    ${p}`);
console.log("");
