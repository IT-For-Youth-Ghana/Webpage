/**
 * CMS-ready contracts for the main public-page section registry.
 *
 * Rendering code consumes only these neutral shapes. Existing domain readers
 * adapt their records into this contract today; a later CMS migration can
 * persist the same ordered blocks without coupling Firestore to React files.
 */

export const PAGE_SECTION_TYPES = [
  "hero",
  "editorialIntro",
  "mediaNarrative",
  "featureCollection",
  "processPath",
  "relationshipMap",
  "metricStory",
  "storyQuote",
  "linkedIndex",
  "publicationFeed",
  "callToAction",
  "newsletterSignup",
] as const;

export type PageSectionType = (typeof PAGE_SECTION_TYPES)[number];
export type PageSectionTheme = "paper" | "warm" | "mist" | "navy" | "teal" | "gold";

export interface SectionHeadingContent {
  eyebrow?: string;
  title: string;
  /**
   * The phrase inside `title` that renders in italic and the accent colour.
   * Must be a substring of `title`; an accent that no longer matches is ignored
   * rather than rendered, so editing the title can never break the headline.
   * Omit it and the section derives an accent from the title's own punctuation.
   * Kept separate from `title` so the title string stays clean for page
   * metadata, breadcrumbs and anything else that needs it flat.
   */
  titleAccent?: string;
  body?: string;
}

export interface SectionMediaContent {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  focalPoint?: "center" | "top" | "bottom" | "left" | "right";
}

export interface SectionActionContent {
  label: string;
  href: string;
  style?: "gold" | "navy" | "light" | "text";
}

export interface SectionMetricContent {
  id: string;
  value: string;
  label: string;
  explanation?: string;
  source?: string;
}

export interface SectionItemContent {
  id: string;
  eyebrow?: string;
  title: string;
  body?: string;
  media?: SectionMediaContent;
  action?: SectionActionContent;
  bullets?: string[];
  meta?: string;
}

interface PageSectionBase<TType extends PageSectionType, TVariant extends string> {
  id: string;
  componentType: TType;
  variant: TVariant;
  anchor?: string;
  navLabel?: string;
  theme?: PageSectionTheme;
  enabled?: boolean;
}

export interface HeroSlideContent extends SectionHeadingContent {
  id: string;
  media: SectionMediaContent;
  actions?: SectionActionContent[];
  caption?: string;
  metrics?: SectionMetricContent[];
}

export interface HeroSection
  extends PageSectionBase<"hero", "split" | "immersive" | "publication" | "data"> {
  slides: HeroSlideContent[];
}

export interface EditorialIntroSection
  extends PageSectionBase<"editorialIntro", "split" | "centered" | "manifesto"> {
  heading: SectionHeadingContent;
  media?: SectionMediaContent;
  metrics?: SectionMetricContent[];
  items?: SectionItemContent[];
}

export interface MediaNarrativeSection
  extends PageSectionBase<"mediaNarrative", "split" | "capsule" | "overlay" | "collage"> {
  heading: SectionHeadingContent;
  media: SectionMediaContent;
  secondaryMedia?: SectionMediaContent[];
  actions?: SectionActionContent[];
  items?: SectionItemContent[];
}

export interface FeatureCollectionSection
  extends PageSectionBase<
    "featureCollection",
    "featuredPair" | "chapters" | "mosaic" | "filmstrip" | "overlay"
  > {
  heading?: SectionHeadingContent;
  items: SectionItemContent[];
}

export interface ProcessPathSection
  extends PageSectionBase<"processPath", "bridge" | "arc" | "numbered" | "venture"> {
  heading: SectionHeadingContent;
  /**
   * Only the `venture` variant reads this: the path runs as a dark panel beside
   * a single photograph. The other variants ignore it.
   */
  media?: SectionMediaContent;
  items: SectionItemContent[];
}

export interface RelationshipMapSection
  extends PageSectionBase<"relationshipMap", "orbit" | "network" | "ecosystem"> {
  heading: SectionHeadingContent;
  items: SectionItemContent[];
  centerLabel?: string;
}

export interface MetricStorySection
  extends PageSectionBase<"metricStory", "strip" | "headline" | "mosaic"> {
  heading?: SectionHeadingContent;
  metrics: SectionMetricContent[];
  media?: SectionMediaContent;
  actions?: SectionActionContent[];
}

export interface StoryQuoteSection
  extends PageSectionBase<"storyQuote", "split" | "dark" | "portrait"> {
  heading: SectionHeadingContent;
  quote: string;
  attribution?: string;
  attributionRole?: string;
  verification?: "verified" | "placeholder" | "unverified";
  media: SectionMediaContent;
  actions?: SectionActionContent[];
}

export interface LinkedIndexSection
  extends PageSectionBase<"linkedIndex", "rows" | "tiles" | "compact"> {
  heading: SectionHeadingContent;
  items: SectionItemContent[];
}

export interface PublicationFeedSection
  extends PageSectionBase<"publicationFeed", "leadGrid" | "newsDesk" | "essayGrid"> {
  heading?: SectionHeadingContent;
  items: SectionItemContent[];
}

export interface CallToActionSection
  extends PageSectionBase<"callToAction", "band" | "application" | "partnership"> {
  heading: SectionHeadingContent;
  actions: SectionActionContent[];
  media?: SectionMediaContent;
}

export interface NewsletterSignupSection
  extends PageSectionBase<"newsletterSignup", "band" | "editorial"> {
  heading: SectionHeadingContent;
  interest: string;
}

export type PageSection =
  | HeroSection
  | EditorialIntroSection
  | MediaNarrativeSection
  | FeatureCollectionSection
  | ProcessPathSection
  | RelationshipMapSection
  | MetricStorySection
  | StoryQuoteSection
  | LinkedIndexSection
  | PublicationFeedSection
  | CallToActionSection
  | NewsletterSignupSection;

export interface PageSectionDocument {
  schemaVersion: 1;
  pageId: string;
  sections: PageSection[];
}
