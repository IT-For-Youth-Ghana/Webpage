import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { getCmsFeaturedArticles } from "@/lib/cms/articles";
import {
  getCmsChallengeSection,
  getCmsDonationCampaign,
  getCmsFeaturedStory,
  getCmsHeroSlides,
  getCmsHomepageTicker,
  getCmsJoinCtaCards,
  getCmsMissionSection,
  getCmsNewsletterSignup,
  getCmsOverviewSection,
  getCmsProgrammeShowcase,
} from "@/lib/cms/homepage";
import { getCmsImpactStats } from "@/lib/cms/impact-stats";
import type { PageSection, SectionItemContent } from "@/types/page-sections";

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export async function HomepageSections() {
  const [
    slides,
    ticker,
    challenge,
    mission,
    overview,
    showcase,
    impactStats,
    campaign,
    story,
    joinCards,
    articles,
    newsletter,
  ] = await Promise.all([
    getCmsHeroSlides(),
    getCmsHomepageTicker(),
    getCmsChallengeSection(),
    getCmsMissionSection(),
    getCmsOverviewSection(),
    getCmsProgrammeShowcase(),
    getCmsImpactStats(),
    getCmsDonationCampaign(),
    getCmsFeaturedStory(),
    getCmsJoinCtaCards(),
    getCmsFeaturedArticles(4),
    getCmsNewsletterSignup(),
  ]);

  const programmeItems: SectionItemContent[] = showcase
    .filter((item) => item.active !== false)
    .map((item) => ({
      id: `home-programme-${item.id}`,
      eyebrow: item.eyebrow,
      title: item.title,
      body: item.description,
      media: { src: item.image, alt: item.title },
      action: { label: `Explore ${item.title}`, href: item.href, style: "text" },
    }));

  const involvementItems: SectionItemContent[] = [
    ...(campaign.active === false ? [] : [{
      id: `campaign-${campaign.id}`,
      eyebrow: campaign.eyebrow,
      title: campaign.headline,
      body: campaign.description,
      media: campaign.image ? { src: campaign.image, alt: campaign.headline } : undefined,
      bullets: campaign.supportPoints,
      meta: `${formatCount(campaign.donorCount)} supporters`,
      action: { label: campaign.primaryCta.label, href: campaign.primaryCta.href, style: "text" as const },
    }]),
    ...joinCards.filter((card) => card.active !== false).map((card) => ({
      id: `join-${card.id}`,
      eyebrow: card.eyebrow,
      title: card.title,
      body: card.description,
      media: card.image ? { src: card.image, alt: card.imageAlt || card.title } : undefined,
      action: { label: card.buttonLabel, href: card.href, style: "text" as const },
    })),
  ];

  const articleItems: SectionItemContent[] = articles.map((article) => ({
    id: `home-article-${article.id || article.slug}`,
    eyebrow: article.type || article.category,
    title: article.title,
    body: article.excerpt,
    media: article.coverImage ? { src: article.coverImage, alt: article.coverAlt || article.title } : undefined,
    meta: article.publishedAt,
    action: { label: "Read article", href: `/news-and-updates/${article.category}/${article.slug}`, style: "text" },
  }));

  const sections: PageSection[] = [
    {
      id: "home-hero", componentType: "hero", variant: "split", theme: "warm",
      slides: slides.map((slide) => ({
        id: slide.id, eyebrow: slide.eyebrow, title: slide.heading, body: slide.body,
        media: { src: slide.image, alt: slide.mediaCaption || "Young people learning and building with technology through ITFYG" },
        caption: slide.mediaCaption,
        actions: [
          { ...slide.cta.primary, style: "gold" },
          ...(slide.cta.secondary ? [{ ...slide.cta.secondary, style: "light" as const }] : []),
        ],
      })),
    },
    {
      id: "home-manifesto", componentType: "editorialIntro", variant: "manifesto", anchor: "about", navLabel: "Why ITFYG", theme: "paper",
      heading: { eyebrow: challenge.title, title: challenge.headline, body: challenge.description },
      media: { src: challenge.image || mission.image, alt: challenge.imageAlt || mission.imageAlt || "An ITFYG learner taking part in a practical digital-skills session" },
      metrics: (impactStats.length ? impactStats : challenge.stats).map((stat, index) => ({ id: `home-stat-${index}`, value: stat.value, label: stat.label, explanation: stat.description })),
      items: [
        { id: "home-problem", title: challenge.problemTitle, body: challenge.problemItems.join(" ") },
        { id: "home-response", title: challenge.solutionTitle, body: challenge.solutionItems.join(" ") },
      ],
    },
    {
      id: "home-programmes", componentType: "featureCollection", variant: "featuredPair", anchor: "programmes", navLabel: "Programmes", theme: "mist",
      heading: { eyebrow: overview.title, title: overview.headline, body: overview.description },
      items: programmeItems,
    },
    {
      id: "home-impact", componentType: "metricStory", variant: "headline", anchor: "impact", navLabel: "Impact", theme: "navy",
      heading: { eyebrow: mission.title, title: mission.missionHeadline || mission.headline, body: mission.missionDescription || mission.description },
      metrics: impactStats.map((stat, index) => ({ id: `impact-${index}`, value: stat.value, label: stat.label, explanation: stat.description })),
      media: { src: mission.image, alt: mission.imageAlt },
      actions: [{ label: mission.ctaLabel, href: mission.ctaHref, style: "light" }],
    },
    {
      id: "home-story", componentType: "storyQuote", variant: "dark", anchor: "stories", navLabel: "Featured story", theme: "paper",
      heading: { eyebrow: story.label, title: story.headline, body: story.programme },
      quote: story.quote, attribution: story.name, attributionRole: story.role,
      media: { src: story.backgroundImage, alt: `${story.name}, ${story.role}` },
      actions: [{ label: story.secondaryCta.label, href: story.secondaryCta.href, style: "navy" }],
    },
    {
      id: "home-involve", componentType: "featureCollection", variant: "chapters", anchor: "involve", navLabel: "Get involved", theme: "teal",
      heading: { eyebrow: "Get involved", title: "Move the work forward with us.", body: "Choose the role that fits you and take a practical next step with IT For Youth Ghana." },
      items: involvementItems,
    },
    {
      id: "home-news", componentType: "publicationFeed", variant: "leadGrid", anchor: "news", navLabel: "News", theme: "paper",
      heading: { eyebrow: "Stories and updates", title: "A publication about the work, not a corporate blog.", body: "Programme moments, ideas, partnerships and lessons from the field become part of the organisation's public record." },
      items: articleItems,
    },
    {
      id: "home-closing", componentType: "newsletterSignup", variant: "editorial", anchor: "stay-connected", navLabel: "Stay connected", theme: "navy",
      heading: { eyebrow: newsletter.eyebrow, title: newsletter.heading, body: newsletter.description },
      interest: newsletter.interest || "homepage",
      enabled: newsletter.active !== false,
    },
  ];

  return (
    <div className="overflow-hidden bg-white">
      <PageSectionRenderer sections={sections.slice(0, 1)} />
      <MarqueeTicker ticker={ticker} />
      <SectionNavigation sections={sections} />
      <PageSectionRenderer sections={sections.slice(1)} />
    </div>
  );
}
