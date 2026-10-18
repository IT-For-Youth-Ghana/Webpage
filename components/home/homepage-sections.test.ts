import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

describe("homepage editorial composition", () => {
  it("adopts the template chapter order through typed section blocks", () => {
    const source = read("components/home/homepage-sections.tsx");
    const ids = [
      "home-hero",
      "home-manifesto",
      "home-programmes",
      "home-impact",
      "home-story",
      "home-involve",
      "home-news",
      "home-closing",
    ];

    let previous = -1;
    for (const id of ids) {
      const position = source.indexOf(`id: "${id}"`);
      assert.ok(position > previous, `${id} must follow the preceding template chapter`);
      previous = position;
    }

    assert.match(source, /const sections: PageSection\[\]/);
    assert.match(source, /<PageSectionRenderer/);
    assert.match(source, /<SectionNavigation/);
    assert.doesNotMatch(source, /<LegacyHomepageSections|<HeroCapsuleSlideshow|<TestimonialsSection/);
  });

  it("keeps every adopted homepage chapter connected to CMS-backed data", () => {
    const source = read("components/home/homepage-sections.tsx");
    for (const reader of [
      "getCmsHeroSlides",
      "getCmsChallengeSection",
      "getCmsMissionSection",
      "getCmsOverviewSection",
      "getCmsProgrammeShowcase",
      "getCmsImpactStats",
      "getCmsDonationCampaign",
      "getCmsFeaturedStory",
      "getCmsJoinCtaCards",
      "getCmsFeaturedArticles",
      "getCmsNewsletterSignup",
    ]) {
      assert.match(source, new RegExp(reader), `${reader} must remain in the homepage data flow`);
    }
  });

  it("disables automatic hero movement when reduced motion is requested", () => {
    const source = read("components/page-sections/editorial-hero.tsx");
    assert.match(source, /prefers-reduced-motion: reduce/);
    assert.match(source, /media\.matches/);
    assert.match(source, /motion-reduce:transition-none/);
  });

  it("places the hero image left and the copy right on desktop", () => {
    const source = read("components/page-sections/editorial-hero.tsx");
    assert.match(source, /lg:ml-auto lg:min-h-\[clamp/);
    assert.match(source, /lg:absolute lg:bottom-5 lg:left-5 lg:top-5/);
    assert.doesNotMatch(source, /lg:absolute lg:bottom-8 lg:right-8 lg:top-8/);
  });

  it("keeps the desktop hero within a laptop viewport", () => {
    const source = read("components/page-sections/editorial-hero.tsx");
    assert.match(source, /lg:min-h-\[clamp\(560px,calc\(100svh-10rem\),640px\)\]/);
    assert.match(source, /lg:py-5/);
    assert.match(source, /text-\[clamp\(2\.8rem,4\.3vw,4\.75rem\)\]/);
  });

  it("loads the CMS marquee and renders it directly after the homepage hero", () => {
    const source = read("components/home/homepage-sections.tsx");
    assert.match(source, /getCmsHomepageTicker\(\)/);
    assert.match(source, /<MarqueeTicker ticker=\{ticker\} \/>/);

    const hero = source.indexOf("<PageSectionRenderer sections={sections.slice(0, 1)}");
    const marquee = source.indexOf("<MarqueeTicker ticker={ticker} />");
    const navigation = source.indexOf("<SectionNavigation sections={sections} />");

    assert.ok(hero >= 0, "homepage hero is missing");
    assert.ok(marquee > hero, "marquee must follow the homepage hero");
    assert.ok(navigation > marquee, "marquee must stay at the hero boundary");
  });

  it("stops the marquee for reduced motion and hides duplicate links", () => {
    const source = read("components/home/marquee-ticker.tsx");
    assert.match(source, /motion-reduce:animate-none/);
    assert.match(source, /const isDuplicate = index >= effective\.length/);
    assert.match(source, /aria-hidden=\{isDuplicate \|\| undefined\}/);
    assert.match(source, /tabIndex=\{isDuplicate \? -1 : undefined\}/);
  });
});
