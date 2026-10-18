import { MediaBand } from "@/components/media/media-band";
import { StorySection } from "@/components/content/story-section";
import { StatsSection } from "@/components/content/stats-section";
import { Button } from "@/components/ui/button";

export type ChallengeSectionContent = {
  title: string;
  headline: string;
  description: string;
  /** Full-bleed band photograph behind the narrative. */
  image?: string;
  imageAlt?: string;
  stats: Array<{ label: string; value: string; description: string }>;
  comparisonTitle: string;
  problemTitle: string;
  problemItems: string[];
  solutionTitle: string;
  solutionItems: string[];
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
  videoUrl?: string;
  videoTitle?: string;
  active?: boolean;
};

export type MissionSectionContent = {
  title: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  imageCaption: string;
  missionTitle: string;
  missionHeadline: string;
  missionDescription: string;
  ctaLabel: string;
  ctaHref: string;
  videoUrl?: string;
  videoTitle?: string;
  active?: boolean;
};

export type OverviewSectionContent = {
  title: string;
  headline: string;
  description: string;
  storyTitle: string;
  storyHeadline: string;
  storyDescription: string;
  callout: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  imageCaption: string;
  ctaLabel: string;
  ctaHref: string;
  videoUrl?: string;
  videoTitle?: string;
  active?: boolean;
};

function Challenge({ content }: { content: ChallengeSectionContent }) {
  if (content.active === false) return null;
  if (!content.title && !content.headline && !content.description && !content.stats.length && !content.problemItems.length && !content.solutionItems.length) return null;

  const hasBand = Boolean(content.image?.trim());

  /* The narrative hook: overlaid on the band when there is a photograph,
     centred on the navy ground when there is not. */
  const hook = (
    <>
      <h2
        className={`font-heading font-bold leading-none text-white ${
          hasBand ? "text-4xl sm:text-5xl lg:text-6xl" : "text-5xl sm:text-6xl lg:text-7xl"
        }`}
      >
        {content.title}
      </h2>
      {content.headline ? (
        <p className="mt-5 font-heading text-2xl font-bold leading-tight text-white/90 sm:text-3xl">
          {content.headline}
        </p>
      ) : null}
      {content.description ? (
        <p className="mt-6 text-lg leading-8 text-white/85">{content.description}</p>
      ) : null}
    </>
  );

  /* Figures, the problem/solution comparison and the call to action. Kept below
     the band rather than crammed into its overlay, which would have squeezed
     four distinct blocks into a 2xl column. */
  const body = (
    <div className="mx-auto max-w-6xl">
      <StatsSection stats={content.stats} tone="navy" />

      <div className="mx-auto mt-12 max-w-4xl border-y border-white/20 py-8">
        <h3 className="text-center font-heading text-2xl font-bold text-white sm:text-3xl">
          {content.comparisonTitle}
        </h3>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-4 text-xl font-semibold text-white">{content.problemTitle}</h4>
            <p className="text-lg leading-8 text-white/80">{content.problemItems.join(" ")}</p>
          </div>
          <div>
            <h4 className="mb-4 text-xl font-semibold text-white">{content.solutionTitle}</h4>
            <p className="text-lg leading-8 text-white/80">{content.solutionItems.join(" ")}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="mb-6 text-lg text-white/90">{content.ctaText}</p>
        <Button href={content.ctaHref} external variant="white" size="lg">
          {content.ctaLabel}
        </Button>
      </div>
    </div>
  );

  /* Full-bleed band. Programme photography is roughly 30:1 landscape, so the
     widest treatment is the one that uses the shape the library actually is,
     rather than cropping a wide frame into a tall hole. See
     docs/addendum-media-pairing.md. */
  if (hasBand) {
    return (
      <>
        <MediaBand
          src={content.image!}
          alt={content.imageAlt || "Learners in an IT For Youth Ghana training session"}
          height="tall"
        >
          {hook}
        </MediaBand>
        <section className="bg-brand-deep px-6 pb-20 pt-14 text-white lg:px-10 lg:pb-24">
          {body}
        </section>
      </>
    );
  }

  return (
    <section className="bg-brand-deep px-6 py-20 text-white lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">{hook}</div>
        {body}
      </div>
    </section>
  );
}

function Vision({ content }: { content: MissionSectionContent }) {
  if (content.active === false) return null;
  if (!content.title && !content.headline && !content.description && !content.image && !content.missionTitle && !content.missionHeadline && !content.missionDescription) return null;

  return <StorySection eyebrow={content.title} title={content.missionTitle || content.headline} headline={content.missionHeadline || content.headline} description={content.missionDescription || content.description} supportingText={content.imageCaption} image={content.image} imageAlt={content.imageAlt} imagePosition="right" videoUrl={content.videoUrl} videoTitle={content.videoTitle} action={content.ctaLabel && content.ctaHref ? { label: content.ctaLabel, href: content.ctaHref, variant: "pink-outline" } : undefined} tone="mist" />;
}

/**
 * The homepage narrative: why this work exists, and what it is aiming at.
 *
 * The overview section that used to lead this group is gone. It answered "what
 * we do", which the programme showcase already answered a few screens later, so
 * its copy now drives the showcase heading instead of repeating it here.
 */
export function LegacyHomepageSections({
  challenge,
  mission,
}: {
  challenge: ChallengeSectionContent;
  mission: MissionSectionContent;
}) {
  return (
    <>
      <Challenge content={challenge} />
      <Vision content={mission} />
    </>
  );
}
