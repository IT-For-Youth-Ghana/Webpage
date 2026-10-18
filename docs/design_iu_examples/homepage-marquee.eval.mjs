import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const homepage = readFileSync("components/home/homepage-sections.tsx", "utf8");
const marquee = readFileSync("components/home/marquee-ticker.tsx", "utf8");
const cms = readFileSync("lib/cms/homepage.ts", "utf8");

const evidence = {
  cmsContract: /export async function getCmsHomepageTicker/.test(cms),
  cmsFetch: /getCmsHomepageTicker\(\)/.test(homepage),
  publicRender: /<MarqueeTicker ticker=\{ticker\} \/>/.test(homepage),
  followsHero:
    homepage.indexOf("<MarqueeTicker ticker={ticker} />") >
      homepage.indexOf("<PageSectionRenderer sections={sections.slice(0, 1)}") &&
    homepage.indexOf("<MarqueeTicker ticker={ticker} />") <
      homepage.indexOf("<SectionNavigation sections={sections} />"),
  namedRegion: /aria-label=\{`\$\{modeLabel\[ticker\.mode\]\} ticker`\}/.test(marquee),
  reducedMotion: /motion-reduce:animate-none/.test(marquee),
  visualCopiesMarkedDuplicate: /const isDuplicate = index >= effective\.length/.test(marquee),
  duplicateLinksRemovedFromTabOrder: /tabIndex=\{isDuplicate \? -1 : undefined\}/.test(marquee),
};

for (const [name, passes] of Object.entries(evidence)) {
  assert.ok(passes, `homepage marquee eval failed: ${name}`);
}

console.log(JSON.stringify({
  suite: "homepage-marquee",
  passed: Object.values(evidence).filter(Boolean).length,
  total: Object.keys(evidence).length,
  evidence,
}, null, 2));
