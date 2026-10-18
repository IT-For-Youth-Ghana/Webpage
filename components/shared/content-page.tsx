import { PanelList } from "@/components/content/panel-list";
import { SectionIntro } from "@/components/content/section-intro";
import { StatsSection } from "@/components/content/stats-section";
import { StorySection } from "@/components/content/story-section";
import { PageContainer } from "@/components/layout/page-container";
import { CircularFigure } from "@/components/media/circular-figure";
import { MediaBand } from "@/components/media/media-band";
import { PortraitFigure } from "@/components/media/portrait-figure";
import { WideFrame } from "@/components/media/wide-frame";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import type { MediaTreatment, SitePage } from "@/types/content";

type ContentPageProps = {
  page: SitePage;
};

/**
 * The shared template behind several hub and custom pages.
 *
 * A section's treatment comes from `section.treatment` when the editor has set
 * one, and from position in the array when they have not. The automatic path is
 * unchanged: treatments ROTATE on a three-step cycle rather than alternating
 * image-left / image-right down the page. Alternation satisfies the pairing rule
 * and still produces something exhausting to scroll, which is the failure mode
 * docs/addendum-media-pairing.md names explicitly. A three-step cycle also
 * guarantees no arrangement repeats twice in a row.
 *
 *   0  wide frame above the text column
 *   1  circular figure beside the text
 *   2  story section, media beside the text, side alternating
 *
 * Position was previously the ONLY input, which meant reordering sections
 * silently restyled them: drag a section up one slot and its photograph changed
 * from a cinema frame to a circular crop, with no way to say "this one is the
 * wide one". `treatment` pins the choice. Leaving it unset keeps the rotation,
 * so every document written before the field existed renders as it did before.
 */

/** Every treatment except the story pair needs a still photograph to render. */
function needsStill(treatment: MediaTreatment) {
  return treatment !== "media-left" && treatment !== "media-right";
}
export function ContentPage({ page }: ContentPageProps) {
  const stats = page.stats.filter(
    (stat) => stat.value.trim() || stat.label.trim() || stat.description?.trim(),
  );
  const sections = page.sections.filter(
    (section) =>
      section.title.trim() || section.body.trim() || section.bullets?.some((b) => b.trim()),
  );
  const ctas = page.ctas.filter((cta) => cta.label.trim() && cta.href.trim());
  const related = page.related.filter((card) => card.title.trim() && card.href.trim());

  return (
    <div className="bg-brand-mist">
      <EditorialImageHero
        imageSrc={page.heroImage}
        imageAlt={page.heroImageAlt?.trim() ?? ""}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={page.intro}
        ctas={ctas.map((cta, i) => ({ ...cta, variant: i === 0 ? "primary" : "secondary" }))}
        priority
      />

      {stats.length ? (
        <StatsSection
          stats={stats}
          eyebrow={page.highlightsEyebrow || "In focus"}
          title="The numbers behind the work"
        />
      ) : null}

      {sections.length ? (
        <section className="space-y-16 py-14 lg:py-20">
          {sections.map((section, index) => {
            const image = section.image?.trim();
            const video = section.videoUrl?.trim();
            /* Alt text is whatever the editor wrote. It is never the section
               title: repeating the heading a screen-reader user has just heard
               is the antipattern types/content.ts:58-62 exists to stop. */
            const imageAlt = section.imageAlt?.trim() ?? "";
            const bullets = (section.bullets ?? []).filter((b) => b?.trim());

            const storySide: MediaTreatment = index % 2 === 0 ? "media-left" : "media-right";
            const automatic: MediaTreatment =
              index % 3 === 0 ? "wide-frame" : index % 3 === 1 ? "circular" : storySide;
            const chosen = section.treatment ?? automatic;
            /* A section holding a video and no still can only be rendered by
               StorySection, which puts the video in the media slot. The other
               treatments used to be handed `undefined` as a next/image src,
               which throws at request time on the visitor's page. */
            const treatment: MediaTreatment = image || !needsStill(chosen) ? chosen : storySide;

            const prose = (
              <>
                <SectionIntro title={section.title} description={section.body || undefined} />
                {bullets.length ? <PanelList className="mt-6" items={bullets} /> : null}
              </>
            );

            /* No image on the record: a considered typographic opening rather
               than a broken frame or one photograph reused down the page. */
            if (!image && !video) {
              return (
                <PageContainer key={section.title}>
                  <div className="grid gap-6 lg:grid-cols-[7rem_minmax(0,1fr)]">
                    <p
                      aria-hidden="true"
                      className="font-heading text-6xl font-bold leading-none text-brand-primary/25"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div>{prose}</div>
                  </div>
                </PageContainer>
              );
            }

            if (treatment === "full-bleed") {
              return (
                <div key={section.title} className="space-y-7">
                  <MediaBand src={image!} alt={imageAlt} height="tall" scrim={false} />
                  <PageContainer>
                    <div className="max-w-3xl">{prose}</div>
                  </PageContainer>
                </div>
              );
            }

            if (treatment === "wide-frame") {
              return (
                <PageContainer key={section.title} className="space-y-7">
                  <WideFrame src={image!} alt={imageAlt} ratio="cinema" />
                  <div className="max-w-3xl">{prose}</div>
                </PageContainer>
              );
            }

            if (treatment === "circular") {
              return (
                <PageContainer key={section.title}>
                  <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
                    <div>{prose}</div>
                    <CircularFigure src={image!} alt={imageAlt} size="lg" />
                  </div>
                </PageContainer>
              );
            }

            if (treatment === "portrait") {
              return (
                <PageContainer key={section.title}>
                  <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div>{prose}</div>
                    <PortraitFigure src={image!} alt={imageAlt} />
                  </div>
                </PageContainer>
              );
            }

            /* Kept inside a PageContainer because it always has been: StorySection
               carries its own max-w-7xl and gutters, so unwrapping it here would
               silently widen every existing story section and stretch its tone
               background to the viewport. */
            return (
              <PageContainer key={section.title}>
                <StorySection
                  title={section.title}
                  description={section.body}
                  supportingText={bullets.length ? bullets.join(" ") : undefined}
                  image={section.image}
                  imageAlt={imageAlt}
                  videoUrl={section.videoUrl}
                  videoTitle={section.videoTitle || section.title}
                  imagePosition={treatment === "media-right" ? "right" : "left"}
                />
              </PageContainer>
            );
          })}
        </section>
      ) : null}

      {related.length ? (
        <PageContainer as="section" className="space-y-8 py-16">
          <SectionIntro
            eyebrow={page.exploreEyebrow || "Related routes"}
            title={page.exploreTitle || "Continue exploring"}
            description={page.exploreDescription || "Discover more routes across the platform."}
          />
          <RouteCardGrid cards={related} />
        </PageContainer>
      ) : null}
    </div>
  );
}
