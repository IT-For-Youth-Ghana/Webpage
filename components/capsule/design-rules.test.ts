import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

/**
 * A ratchet for the redesign's hard rules.
 *
 * The brief bans icons, visible bullet lists, and arbitrary radius values in
 * redesigned components. Those are mechanical properties, so they are checked
 * mechanically rather than trusted to review.
 *
 * REDESIGNED grows as more of the site is reworked. Files not listed here are
 * pre-redesign and deliberately exempt, so this stays a ratchet instead of a
 * repo-wide failure.
 */
const REDESIGNED = [
  "components/capsule/capsule-shell.tsx",
  "components/capsule/capsule-media.tsx",
  "components/capsule/capsule-content.tsx",
  "components/capsule/capsule-actions.tsx",
  "components/capsule/capsule-stage.tsx",
  "components/capsule/slideshow-controls.tsx",
  "components/content/panel-list.tsx",
  "components/content/process-sequence.tsx",
  "components/home/hero-capsule-slideshow.tsx",
  "components/what-we-do/initiative-page.tsx",
  "components/what-we-do/what-we-do-overview-page.tsx",
  "components/what-we-do/initiative-orbit.tsx",
  "components/what-we-do/pathway-tree.tsx",
  "components/capsule/capsule-page-hero.tsx",
  "components/content/section-intro.tsx",
  "components/content/label-pills.tsx",
  "components/shared/route-card-grid.tsx",
  "components/home/closing-block.tsx",
  "components/home/programme-showcase.tsx",
  "components/training/apply-for-training-overview-page.tsx",
  "components/training/training-who-can-apply-page.tsx",
  "components/training/training-how-it-works-page.tsx",
  "components/training/training-course-listing-page.tsx",
  "components/training/training-course-catalog.tsx",
  "components/training/training-cohort-timeline.tsx",
  "components/training/training-process-strip.tsx",
  "components/programs/course-detail-card.tsx",
  "components/media/filmstrip.tsx",
  "components/media/overlap-composition.tsx",
];

const read = (path: string) => readFileSync(path, "utf8");

describe("redesign design rules", () => {
  it("imports no icon library", () => {
    for (const path of REDESIGNED) {
      const source = read(path);
      assert.ok(!/from "lucide-react"/.test(source), `${path} imports lucide-react`);
      assert.ok(
        !/emojiToIconImage/.test(source),
        `${path} renders emoji-derived icons`,
      );
    }
  });

  it("renders no emoji", () => {
    // Covers the pictographic and dingbat ranges the content model uses.
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
    for (const path of REDESIGNED) {
      const match = read(path).match(emoji);
      assert.equal(match, null, `${path} contains emoji ${match?.[0]}`);
    }
  });

  it("uses named radius tokens, never arbitrary values", () => {
    for (const path of REDESIGNED) {
      const hits = read(path).match(/rounded-\[[^\]]+\]/g);
      assert.equal(
        hits,
        null,
        `${path} uses arbitrary radii ${JSON.stringify(hits)}; use rounded-control, rounded-media, rounded-panel or rounded-capsule`,
      );
    }
  });

  it("never renders an unordered list in page content", () => {
    for (const path of REDESIGNED) {
      assert.ok(!/<ul[\s>]/.test(read(path)), `${path} renders a <ul>`);
    }
  });

  it("marks any ordered list as list-none so no marker is drawn", () => {
    for (const path of REDESIGNED) {
      const source = read(path);
      for (const tag of source.match(/<ol[^>]*>/g) ?? []) {
        assert.ok(
          /list-none/.test(tag),
          `${path} has an <ol> without list-none: ${tag}`,
        );
      }
    }
  });

  it("keeps every animation behind a reduced-motion fallback", () => {
    const globals = read("app/globals.css");
    const reduced = globals.slice(globals.indexOf("@media (prefers-reduced-motion: reduce)"));
    // The bloom and cue animations were removed with the stage they belonged to.
    // Derived from the stylesheet rather than hardcoded, so the list cannot go
    // stale again: every itfy-animate-* utility must have a fallback.
    const defined = [...globals.matchAll(/\.(itfy-animate-[a-z-]+)\s*\{/g)].map((m) => m[1]);
    assert.ok(defined.length > 0, "no itfy-animate-* utilities found");
    for (const cls of defined) {
      assert.ok(reduced.includes(cls), `${cls} has no reduced-motion fallback`);
    }
  });

  it("never starts autoplay under reduced motion", () => {
    const source = read("components/capsule/use-slideshow.ts");
    assert.match(source, /prefersReducedMotion/);
    assert.match(source, /canAutoplay\s*=\s*autoplay\s*&&\s*!prefersReducedMotion/);
  });

  it("gives every slideshow control an accessible name", () => {
    const source = read("components/capsule/slideshow-controls.tsx");
    for (const name of ["Previous slide", "Next slide", "Pause slideshow", "Play slideshow"]) {
      assert.ok(source.includes(name), `missing accessible name: ${name}`);
    }
    // Pager buttons build their label from the slide, so check the template.
    assert.match(source, /aria-label=\{`Slide \$\{slide \+ 1\}/);
  });

  it("keeps slideshow controls usable on narrow phones", () => {
    const source = read("components/capsule/slideshow-controls.tsx");
    assert.match(source, /inline-flex size-11/);
    assert.match(source, /gap-2 px-2 min-\[431px\]:gap-/);
    assert.match(source, /hidden items-center gap-\[7px\] min-\[431px\]:flex/);
  });

  it("puts the round end on the LEADING side, where the lens is", () => {
    // The bug this exists to prevent: CSS Backgrounds 3 section 5.5 scales
    // EVERY corner radius by one global factor f = min(Li / Si) when any side's
    // radii overflow it. Declaring 999px on the trailing corners of a 1180x460
    // shell drove f to 0.23, shrinking the 230px leading corners to 53px and
    // leaving only the trailing end round: the capsule rendered mirrored.
    const resolve = (w: number, h: number, tl: number, tr: number, br: number, bl: number) => {
      const sides: Array<[number, number]> = [
        [w, tl + tr],
        [h, tr + br],
        [w, br + bl],
        [h, tl + bl],
      ];
      let f = 1;
      for (const [length, sum] of sides) if (sum > 0) f = Math.min(f, length / sum);
      return { tl: tl * f, tr: tr * f, br: br * f, bl: bl * f, f };
    };

    const PANEL = 24;

    for (const [w, h] of [
      [1180, 460],
      [1872, 1032],
      [1394, 854],
      [991, 531],
    ]) {
      const r = resolve(w, h, h / 2, PANEL, PANEL, h / 2);
      assert.equal(r.f, 1, `${w}x${h}: a side overflowed, so every radius shrank`);
      assert.ok(
        Math.abs(r.tl - h / 2) < 0.01 && Math.abs(r.bl - h / 2) < 0.01,
        `${w}x${h}: leading arc ${r.tl} does not match the lens radius ${h / 2}`,
      );
      assert.ok(r.tl > r.tr, `${w}x${h}: the round end is on the trailing side`);
    }

    // And the regression itself must still be detectable by this model.
    const broken = resolve(1180, 460, 230, 999, 999, 230);
    assert.ok(broken.tl < broken.tr, "the model no longer reproduces the original bug");
  });

  it("never declares --radius-capsule on the capsule's trailing corners", () => {
    const globals = read("app/globals.css");
    const decl = globals
      .slice(globals.indexOf(".itfy-capsule {"))
      .match(/border-radius:[^;]+;/);
    assert.ok(decl, "no border-radius found on .itfy-capsule");
    assert.ok(
      !/--radius-capsule/.test(decl[0]),
      `999px on any corner drags the global scaling factor down: ${decl[0]}`,
    );
    assert.match(decl[0], /calc\(var\(--capsule-h\)\s*\/\s*2\)/);
  });

  it("derives the capsule end radius from the lens size", () => {
    const globals = read("app/globals.css");
    assert.match(globals, /border-radius:\s*\n?\s*calc\(var\(--capsule-h\)\s*\/\s*2\)/);
    assert.ok(
      // [^}] already spans newlines, so the dotAll flag was never needed
      // (and it requires an ES2018 target, which this tsconfig does not set).
      /\.itfy-capsule__media\s*\{[^}]*align-self:\s*center/.test(globals),
      "the lens must be centred, never stretched, or it stops being square",
    );
  });

  it("keeps the homepage media inside a rounded rectangular shell", () => {
    const globals = read("app/globals.css");
    const heroShell = globals.match(/\.itfy-capsule\.itfy-capsule--hero\s*\{[^}]+\}/)?.[0];
    const heroMedia = globals.match(/\.itfy-capsule--hero \.itfy-capsule__media\s*\{[^}]+\}/)?.[0];
    const heroLens = globals.match(/\.itfy-capsule--hero \.itfy-lens\s*\{[^}]+\}/)?.[0];

    assert.ok(heroShell, "missing hero capsule geometry");
    assert.match(heroShell, /--capsule-h:\s*var\(--hero-capsule-h\)/);
    assert.match(heroShell, /grid-template-columns:/);
    assert.match(heroShell, /overflow:\s*hidden/);
    assert.match(heroShell, /border-radius:\s*var\(--radius-panel\)/);
    assert.ok(!/calc\(var\(--capsule-h\)\s*\/\s*2\)/.test(heroShell));

    assert.ok(heroMedia, "missing contained media geometry");
    assert.match(heroMedia, /padding:\s*var\(--hero-media-inset\)/);
    assert.ok(heroLens, "missing contained lens geometry");
    assert.match(heroLens, /position:\s*relative/);
    assert.match(heroLens, /aspect-ratio:\s*1\s*\/\s*1/);
  });

  it("puts the blurred duplicate on the HERO, not inside the capsule", () => {
    // The concept sketch labels the blur "blurred media as bg" with the arrow
    // pointing at the hero behind the shell. It has to be visible AROUND the
    // capsule for that to mean anything: sharp in the lens, soft everywhere
    // else. Clipping it inside the shell left the hero a flat navy field, and
    // an earlier version of this test asserted exactly that wrong arrangement.
    const hero = read("components/home/hero-capsule-slideshow.tsx");
    const shell = read("components/capsule/capsule-shell.tsx");
    const stage = read("components/capsule/capsule-stage.tsx");

    assert.match(stage, /from "next\/image"/, "the stage must render the slide images");
    assert.match(stage, /itfy-stage__shot/);
    assert.match(stage, /overlayFrom/, "the stage owns the per-slide wash");
    assert.match(hero, /<CapsuleStage[\s\S]{0,200}images=\{slides\.map/);

    assert.ok(
      !shell.includes("{background}"),
      "the shell must not carry a background slot once the blur lives on the stage",
    );
    assert.ok(
      !hero.includes("CapsuleGround"),
      "CapsuleGround was removed; its job is the stage's now",
    );
  });

  it("keeps the hero shell translucent so the blur reads through it", () => {
    const globals = read("app/globals.css");
    const block = globals
      .slice(globals.indexOf(".itfy-capsule--hero.itfy-capsule--dark"))
      .slice(0, 400);
    assert.match(block, /backdrop-filter:\s*blur/, "a glass shell over a photograph needs the blur");
    assert.ok(
      !/backdrop-filter:\s*none/.test(block),
      "the shell had backdrop-filter disabled while the photo sat inside it; there is a photo behind it now",
    );
  });

  it("removes the merge mask from the contained hero lens", () => {
    const globals = read("app/globals.css");
    const override = globals.match(/\.itfy-capsule--hero \.itfy-lens__frame\s*\{[^}]+\}/)?.[0];
    assert.ok(override, "missing hero lens mask override");
    assert.match(override, /-webkit-mask-image:\s*none/);
    assert.match(override, /mask-image:\s*none/);
  });

  it("keeps the pathway column weights out of an inline style", () => {
    // An inline grid-template-columns outranks every utility class, so the
    // stacked layout below 1024px could never override it.
    const source = read("components/what-we-do/pathway-tree.tsx");
    assert.ok(
      !/gridTemplateColumns:/.test(source),
      "column weights must arrive as --pathway-columns, not an inline grid declaration",
    );
    assert.match(source, /--pathway-columns/);

    const globals = read("app/globals.css");
    assert.match(globals, /\.itfy-pathway\s*\{[^}]*grid-template-columns:\s*var\(--pathway-columns/);
    assert.match(globals, /@media \(max-width: 1023px\)[\s\S]{0,200}grid-template-columns:\s*1fr/);
  });

  it("gates the orbit's proximity behaviour on a hover-capable pointer", () => {
    const source = read("components/what-we-do/initiative-orbit.tsx");
    assert.match(source, /\(min-width: 821px\) and \(hover: hover\)/);
    assert.match(source, /prefersReducedMotion/);
    // Click and focus must work regardless of pointer capability.
    assert.match(source, /onFocus=/);
    assert.match(source, /href=\{`\/what-we-do\//);
  });

  it("gives an interior page hero the contained lens, not the leading lobe", () => {
    // The leading-lobe pill's whole purpose is the merge mask that dissolves
    // the photograph into the shell's fill. On a hero that mask faded a ghost
    // of the photograph across the headline and left a seam where it ended, so
    // the page hero takes the homepage's contained-lens shell instead.
    const source = read("components/capsule/capsule-page-hero.tsx");
    assert.match(source, /<CapsuleShell\s+variant="pageHero"/);
    assert.match(source, /<CapsuleStage[\s\S]{0,120}variant="page"/);
    assert.ok(!/tone="paper"/.test(source), "the page hero is glass on a photograph, not paper");

    const shell = read("components/capsule/capsule-shell.tsx");
    assert.match(shell, /variant !== "inline" && "itfy-capsule--hero"/);
    assert.match(shell, /variant === "pageHero" && "itfy-capsule--page"/);
  });

  it("keeps the interior hero shell shallower than the homepage's", () => {
    const globals = read("app/globals.css");
    const stage = globals.match(/\.itfy-hero-stage\.itfy-hero-stage--page\s*\{[^}]+\}/)?.[0];
    assert.ok(stage, "missing interior page stage geometry");
    // No slideshow, so no controls band to reserve below the shell.
    assert.match(stage, /--hero-controls-h:\s*0px/);
    assert.match(stage, /--page-capsule-ratio:\s*2\.1/);
    assert.match(stage, /560px/, "the interior shell must stay below the homepage's 680px cap");

    const shell = globals.match(/\.itfy-capsule--hero\.itfy-capsule--page\s*\{[^}]+\}/)?.[0];
    assert.ok(shell, "missing interior shell ratio");
    assert.match(shell, /aspect-ratio:\s*var\(--page-capsule-ratio\)\s*\/\s*1/);
  });

  it("aligns the breadcrumb row with the shell it sits above", () => {
    // The row and the shell are siblings in a centred grid, so the only way
    // their left edges meet is for the row to compute the same width the shell
    // does: min(available, cap, height x ratio). Same variables, no literals.
    const globals = read("app/globals.css");
    const crumbs = globals.match(/\.itfy-stage__crumbs\s*\{[^}]+\}/)?.[0];
    assert.ok(crumbs, "missing breadcrumb row geometry");
    assert.match(crumbs, /var\(--capsule-max-w\)/);
    assert.match(crumbs, /calc\(var\(--hero-capsule-h\)\s*\*\s*var\(--page-capsule-ratio\)\)/);
  });

  it("puts breadcrumbs on the dark ground in light ink", () => {
    // They used to sit on a light band. Moving the hero onto a photograph
    // without moving the ink would have left slate-500 on near-black.
    const source = read("components/capsule/capsule-page-hero.tsx");
    const crumbs = source.slice(source.indexOf('aria-label="Breadcrumb"'), source.indexOf("</nav>"));
    assert.ok(crumbs.length > 0, "no breadcrumb markup found");
    assert.ok(!/text-slate-|text-brand-ink/.test(crumbs), "dark ink on the dark stage");
    assert.match(crumbs, /text-white\/65/);
    assert.match(crumbs, /font-semibold text-white/, "the current page is the emphasised crumb");
  });

  it("keeps the accent on a lens with no autoplay to report", () => {
    // A static lens has no progress arc, and without the ring the page's
    // identity colour disappears from the hero entirely.
    const media = read("components/capsule/capsule-media.tsx");
    assert.match(media, /accentRing\?:\s*boolean/);
    assert.match(media, /const showRing = showProgress \|\| accentRing/);
    // A closed circle: offset 0 whenever there is no progress to draw.
    assert.match(media, /ringOffset\s*=\s*typeof progress === "number" && showProgress \? 100 - progress : 0/);
    assert.match(read("components/capsule/capsule-page-hero.tsx"), /accentRing/);
  });

  it("keeps var() out of SVG presentation attributes", () => {
    // CSS custom properties do not resolve there, so the ring would vanish.
    for (const path of REDESIGNED) {
      assert.ok(
        !/(?:stroke|fill|stopColor|stop-color)=\{?["']?var\(/.test(read(path)),
        `${path} puts var() in an SVG presentation attribute`,
      );
    }
  });
});
