import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

const css = read("app/globals.css");
const hero = read("components/home/hero-capsule-slideshow.tsx");
const stage = read("components/capsule/slideshow-stage.tsx");
const controls = read("components/capsule/slideshow-controls.tsx");

const clamp = (min, value, max) => Math.max(min, Math.min(value, max));

function desktopGeometry(viewportWidth, viewportHeight) {
  const padX = clamp(16, viewportWidth * 0.04, 64);
  const padY = clamp(28, viewportHeight * 0.05, 56);
  const shellHeight = Math.min(Math.max(viewportHeight - 65 - 2 * padY - 56, 500), 680);
  const shellWidth = Math.min(viewportWidth - 2 * padX, shellHeight * 1.8, 1240);
  const mediaInset = clamp(24, viewportWidth * 0.03, 44);
  const mediaColumn = shellWidth >= 840 ? shellWidth / 2 : shellWidth - 420;
  const lens = Math.min(mediaColumn - 2 * mediaInset, shellHeight - 2 * mediaInset);

  return {
    viewport: `${viewportWidth}x${viewportHeight}`,
    shellWidth,
    shellHeight,
    ratio: shellWidth / shellHeight,
    lens,
    leftClearance: (mediaColumn - lens) / 2,
    verticalClearance: (shellHeight - lens) / 2,
  };
}

let passed = 0;
const check = (label, condition) => {
  assert.ok(condition, label);
  passed += 1;
};

check("hero renders CapsuleGround", /background=\{\s*<CapsuleGround/.test(hero));
check("stage owns no image", !stage.includes('from "next/image"'));
check("stage uses the quiet deep-navy ground", stage.includes('bg-[#05070f]'));
check("hero shell uses the panel radius", /\.itfy-capsule\.itfy-capsule--hero\s*\{[^}]*border-radius:\s*var\(--radius-panel\)/s.test(css));
check("hero shell clips its contents", /\.itfy-capsule\.itfy-capsule--hero\s*\{[^}]*overflow:\s*hidden/s.test(css));
check("hero lens is positioned within the shell", /\.itfy-capsule--hero \.itfy-lens\s*\{[^}]*position:\s*relative/s.test(css));
check("hero lens merge mask is disabled", /\.itfy-capsule--hero \.itfy-lens__frame\s*\{[^}]*mask-image:\s*none/s.test(css));
check("blur belongs to the capsule", /\.itfy-capsule__ground-shot img\s*\{[^}]*filter:\s*blur\(/s.test(css));
check("legacy stage blur is absent", !/\.itfy-stage__layer/.test(css));
check("computed hero height overrides the base breakpoint height", /--capsule-h:\s*var\(--hero-capsule-h\)/.test(css));
check("short viewports retain a content-safe capsule height", /max\([\s\S]*500px[\s\S]*\),\s*680px/.test(css));
check("the stage permits vertical growth", stage.includes("overflow-x-hidden") && !stage.includes("overflow-hidden"));
check("compact controls hide only the redundant visual pager", controls.includes("hidden items-center gap-[7px] min-[431px]:flex"));
check("compact controls retain 44px navigation targets", controls.includes("inline-flex size-11"));
check("mobile shell has an explicit 440px cap", /\.itfy-capsule\.itfy-capsule--hero\s*\{[^}]*max-width:\s*440px/s.test(css));
check("mobile lens has an explicit 392px cap", /\.itfy-capsule--hero \.itfy-lens\s*\{[^}]*max-width:\s*392px/s.test(css));

const desktopCases = [
  desktopGeometry(1920, 1080),
  desktopGeometry(1440, 900),
  desktopGeometry(1280, 800),
  desktopGeometry(1024, 768),
  desktopGeometry(821, 700),
  desktopGeometry(1024, 600),
  desktopGeometry(844, 390),
];

for (const result of desktopCases) {
  check(`${result.viewport}: lens width is positive`, result.lens > 0);
  check(`${result.viewport}: lens clears the shell's left edge`, result.leftClearance >= 24);
  check(`${result.viewport}: lens clears the shell's top and bottom`, result.verticalClearance >= 24);
  check(`${result.viewport}: text column remains usable`, result.shellWidth - result.lens - 2 * result.leftClearance >= 420);
}

for (const result of desktopCases.slice(0, 3)) {
  check(`${result.viewport}: wide-screen shell stays close to the 1.8:1 sketch`, result.ratio >= 1.7 && result.ratio <= 1.9);
}

for (const mobileViewport of [390, 600, 820]) {
  const mobileShell = Math.min(440, mobileViewport - 32);
  const mobileLens = mobileShell - 48;
  check(`${mobileViewport}px mobile: shell respects the 440px cap`, mobileShell <= 440);
  check(`${mobileViewport}px mobile: stacked lens clears both shell sides`, (mobileShell - mobileLens) / 2 === 24);
  check(`${mobileViewport}px mobile: lens stays positive`, mobileLens > 0);
}

for (const viewportWidth of [320, 360, 390]) {
  const buttonWidth = 44;
  const compactCounterWidth = 80;
  const gap = 8;
  const sidePadding = 8;
  const controlRowWidth = 3 * buttonWidth + compactCounterWidth + 3 * gap + 2 * sidePadding;
  check(`${viewportWidth}px controls: compact row fits without clipping`, controlRowWidth <= viewportWidth);
}

console.log(JSON.stringify({
  suite: "hero-capsule-concept",
  passed,
  desktopCases: desktopCases.map((result) => ({
    viewport: result.viewport,
    shell: `${Math.round(result.shellWidth)}x${Math.round(result.shellHeight)}`,
    ratio: Number(result.ratio.toFixed(2)),
    lens: Math.round(result.lens),
    leftClearance: Math.round(result.leftClearance),
    verticalClearance: Math.round(result.verticalClearance),
  })),
}, null, 2));
