import type { Course } from "@/types/course";

export interface ActionLink {
  label: string;
  href: string;
}

/**
 * types/content.ts
 *
 * Shared content types used across components and site-config.
 * Keep this as the single source for primitive content shapes.
 */

export type HighlightStat = {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  // New: optional image URL for replacing emoji icons
  iconImage?: string;
};

export type RouteCard = {
  href: string;
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  items?: { label: string; href: string }[];
};

/**
 * How an editorial block pairs its text with its media.
 *
 * Layout used to be derived from array position: components/shared/content-page.tsx
 * ran `index % 3`, so dragging a section up one slot silently changed its
 * photograph from a cinema frame to a circular crop, and no editor could say
 * "this one is the wide one".
 *
 * Absent means "let the template decide", which keeps the index rotation as the
 * default and leaves every document written before this field existed rendering
 * exactly as it does today. A set value pins the treatment.
 *
 * This list is deliberately short and closed. Every value maps to a primitive
 * that already exists in components/media/ and needs nothing from the record
 * beyond `image` and `imageAlt`. It is a set of strong editorial variants, not a
 * page builder: an editor picks one, and cannot invent a layout.
 */
export type MediaTreatment =
  /** WideFrame, a contained cinema plate above the text column. */
  | "wide-frame"
  /** MediaBand, edge to edge across the viewport. */
  | "full-bleed"
  /** StorySection with the media on the left. */
  | "media-left"
  /** StorySection with the media on the right. */
  | "media-right"
  /** CircularFigure beside the text. Crops cleanly from any source. */
  | "circular"
  /** PortraitFigure. For people: profiles, named testimonials, graduates. */
  | "portrait";

/**
 * The treatment list in editor order, with the labels the admin `<select>`
 * shows. One declaration so the type, the form and the gate test cannot drift.
 */
export const MEDIA_TREATMENTS: readonly { value: MediaTreatment; label: string }[] = [
  { value: "wide-frame", label: "Wide frame above the text" },
  { value: "full-bleed", label: "Full-bleed band" },
  { value: "media-left", label: "Media left, text right" },
  { value: "media-right", label: "Text left, media right" },
  { value: "circular", label: "Circular figure beside the text" },
  { value: "portrait", label: "Portrait frame (people)" },
] as const;

export interface ContentBlock {
  title: string;
  body: string;
  bullets?: string[];
  // Optional editorial media for pairing text with visuals
  image?: string;
  imageAlt?: string;
  videoUrl?: string;
  videoTitle?: string;
  /**
   * Pins the layout of this block. Omit to keep the template's automatic
   * rotation, which is what every pre-existing document does.
   */
  treatment?: MediaTreatment;
}


export interface SitePage {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  heroImage?: string;
  /**
   * What is happening in the hero photograph. Not a restatement of the title:
   * the template previously passed the page title as alt text, which tells a
   * screen-reader user nothing they had not already heard.
   */
  heroImageAlt?: string;
  // Optional: video to feature in the page hero
  heroVideoUrl?: string;
  // Optional: thumbnail image to show when the hero video is present
  heroVideoThumbnail?: string;
  /** Optional: video to feature alongside the overview/story intro */
  overviewVideoUrl?: string;
  overviewVideoTitle?: string;
  stats: HighlightStat[];
  sections: ContentBlock[];
  ctas: ActionLink[];
  related: RouteCard[];
  courses?: Course[];
  cohorts?: TrainingCohort[];
  process?: TrainingProcessStep[];
  // Optional UI copy for section headings and blurbs
  overviewTitle?: string;
  overviewDescription?: string;
  operatingEyebrow?: string;
  operatingTitle?: string;
  operatingDescription?: string;
  principlesEyebrow?: string;
  principlesTitle?: string;
  principlesDescription?: string;
  principlesHeroEyebrow?: string;
  principlesHeroTitle?: string;
  principlesImage?: string;
  principlesImageAlt?: string;
  highlightsEyebrow?: string;
  exploreEyebrow?: string;
  exploreTitle?: string;
  exploreDescription?: string;
  processEyebrow?: string;
  processTitle?: string;
  processDescription?: string;
  nextStepEyebrow?: string;
  nextStepTitle?: string;
  nextStepDescription?: string;
}

export type DynamicSitePageStatus = "draft" | "published" | "archived";

export interface DynamicSitePage extends SitePage {
  id: string;
  parentSlug: string;
  status: DynamicSitePageStatus;
  order: number;
}

export type TeamMemberStatus = "active" | "inactive";

export type JobType = "full-time" | "part-time" | "contract" | "volunteer";

export type JobStatus = "draft" | "published" | "closed";

export interface JobListing {
  id: string;
  title: string;
  summary: string;
  team: string;
  location: string;
  type: JobType;
  status: JobStatus;
  applyUrl?: string;
  closingDate?: string;
  featured: boolean;
}

export interface TeamMemberProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  departmentId?: string;
  departmentSlug?: string;
  bio: string;
  photo?: string;
  email?: string;
  linkedin?: string;
  featured: boolean;
  status: TeamMemberStatus;
  order: number;
}

export type DepartmentStatus = "draft" | "published" | "archived";

export interface DepartmentProcessStep {
  title: string;
  description: string;
}

export interface DepartmentResource {
  label: string;
  href: string;
  description?: string;
}

export interface DepartmentContact {
  name?: string;
  role?: string;
  email?: string;
}

export interface DepartmentProfile {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  intro: string;
  mission: string;
  heroImage?: string;
  icon?: string;
  // New: optional image URL for department icon
  iconImage?: string;
  color?: string;
  responsibilities: string[];
  services: ContentBlock[];
  workflows: DepartmentProcessStep[];
  priorities: string[];
  stats: HighlightStat[];
  teamMemberIds: string[];
  resources: DepartmentResource[];
  contact?: DepartmentContact;
  ctas: ActionLink[];
  featured: boolean;
  status: DepartmentStatus;
  order: number;
}

/**
 * A single hero slide.
 *
 * Lives here rather than beside the hero component because lib/content and
 * lib/cms both consume it: a data contract owned by presentation code is a
 * dependency inversion, not a convenience.
 */
export interface HeroSlide {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  image: string;

  /**
   * Per-slide panel colours, giving each slide its own identity.
   * Example: overlayFrom "rgba(10,15,40,0.88)", overlayTo "rgba(10,15,40,0.35)".
   */
  overlayFrom: string;
  overlayTo: string;

  /**
   * Optional per-slide identity colour, used for the lens progress ring, the
   * eyebrow rule, the stage bloom and the active pager bar. Falls back to the
   * brand primary when unset, so existing CMS documents keep working.
   */
  accent?: string;

  /** Optional short caption shown on the lens. */
  mediaCaption?: string;

  cta: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
}

/**
 * A "join the movement" card on the homepage closing block.
 *
 * Lives here rather than beside a component because lib/content and lib/cms
 * both consume it.
 */
/**
 * The active donation campaign.
 *
 * Lives here rather than beside the component because lib/content, lib/cms, the
 * admin editor and two public routes all consume it: a data contract owned by
 * presentation code is a dependency inversion, not a convenience.
 */
export type DonationCampaignContent = {
  id: string;
  eyebrow: string;
  headline: string;
  description: string;
  image?: string;
  currency?: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  deadline: string;
  supportPoints?: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  active?: boolean;
};

export interface JoinCtaCard {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;

  /**
   * Audience key. Retained so existing documents and the admin editor keep
   * working, but no longer used to select an icon: the redesign carries weight
   * through colour, shape, type and spacing.
   */
  icon: "students" | "organisations" | "volunteer";

  /**
   * Circular portrait for this audience. The circular crop is the one treatment
   * the landscape/portrait split does not constrain, because it crops cleanly
   * from either library. See docs/addendum-media-pairing.md.
   */
  image?: string;
  imageAlt?: string;
  active?: boolean;
}

/** Newsletter sign-up copy for the homepage closing block. */
export interface NewsletterSignupContent {
  eyebrow: string;
  heading: string;
  description: string;
  privacyNote: string;
  interest?: string;
  active?: boolean;
}

export interface HomepageSection {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  variant: "light" | "navy" | "gold";
  cta?: ActionLink;
  items?: string[];
}

export interface InitiativeProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
  // Optional image URL alternative to icon
  iconImage?: string;
}

export interface InitiativeAudience {
  summary: string;
  groups: string[];
  eligibility: string[];
}

export interface InitiativeGalleryImage {
  src: string;
  alt: string;
}

export interface InitiativeTestimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface InitiativePartner {
  name: string;
  description: string;
  href?: string;
  logo?: string;
}

export interface InitiativeFaq {
  question: string;
  answer: string;
}

export interface InitiativeApplyCta {
  heading: string;
  description: string;
  primary: ActionLink;
  secondary: ActionLink;
}

export interface InitiativeSectionContent {
  overviewEyebrow: string;
  overviewTitle: string;
  overviewImageAlt: string;
  howItWorksEyebrow: string;
  howItWorksTitle: string;
  howItWorksDescription: string;
  impactEyebrow: string;
  impactTitle: string;
  impactDescription: string;
  audienceEyebrow: string;
  eligibilityEyebrow: string;
  galleryEyebrow: string;
  galleryTitle: string;
  galleryDescription: string;
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  partnersEyebrow: string;
  partnersTitle: string;
  partnersDescription: string;
  partnerLinkLabel: string;
  faqsEyebrow: string;
  faqsTitle: string;
  faqsDescription: string;
  applyCtaEyebrow: string;
  relatedEyebrow: string;
  relatedTitle: string;
  relatedDescription: string;
  shareEyebrow: string;
  quickLinksEyebrow: string;
}

export interface InitiativePage extends SitePage {
  tagline: string;

  /**
   * The initiative's identity colour, used for the capsule rim, the eyebrow
   * rule, section markers and the pathway node. Optional so existing Firestore
   * documents keep working; falls back to the brand primary.
   */
  accent?: string;

  heroImage: string;
  overviewImage: string;
  mission: string;
  objectives: string[];
  howItWorks: InitiativeProcessStep[];
  impactStats: HighlightStat[];
  audience: InitiativeAudience;
  gallery: InitiativeGalleryImage[];
  testimonials: InitiativeTestimonial[];
  partners: InitiativePartner[];
  faqs: InitiativeFaq[];
  applyCta: InitiativeApplyCta;
  sectionContent: InitiativeSectionContent;
  quickLinks: ActionLink[];
}

export type ArticleCategory = "news" | "blogs";

export type ArticleStatus = "draft" | "published" | "archived";

export type ArticleDisplayType = "News" | "Blog" | "Event" | "Press";

export interface ArticleAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface ArticleSeo {
  title: string;
  description: string;
  ogImage?: string;
}

export interface ArticleSeed {
  id?: string;
  slug: string;
  category: ArticleCategory;
  status?: ArticleStatus;
  type?: ArticleDisplayType;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  coverAlt?: string;
  tags?: string[];
  author?: ArticleAuthor;
  featured?: boolean;
  seo?: ArticleSeo;
  readTimeMinutes?: number;
  content: string[];
  contentHtml?: string;
}

export interface NewsHubContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  editorialPillars: ContentBlock[];
  routeCards: RouteCard[];
  heroCtas: ActionLink[];
  featuredSectionEyebrow: string;
  featuredSectionTitle: string;
  featuredSectionDescription: string;
  browseSectionEyebrow: string;
  browseSectionTitle: string;
  browseSectionDescription: string;
  editorialSectionEyebrow: string;
  editorialSectionTitle: string;
  editorialSectionDescription: string;
  latestSectionEyebrow: string;
  latestSectionTitle: string;
  latestSectionDescription: string;
  subscribeSectionEyebrow: string;
  subscribeSectionTitle: string;
  subscribeSectionDescription: string;
  subscribeCtas: ActionLink[];
}

export interface ArticleCategoryContent {
  category: ArticleCategory;
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  emptyState: string;
  heroCtaLabel: string;
  leadSectionEyebrow: string;
  leadSectionTitle: string;
  leadSectionDescription: string;
  archiveSectionEyebrow: string;
  archiveSectionTitle: string;
  archiveSectionDescription: string;
  topicsSectionEyebrow: string;
  topicsSectionTitle: string;
  topicsSectionDescription: string;
  latestSignalEyebrow: string;
  latestSignalCtaLabel: string;
}

export interface TrainingFocusCard {
  title: string;
  description: string;
}

export interface TrainingCohort {
  id: string;
  name: string;
  startDate: string;
  applicationDeadline?: string;
  summary: string;
  format: string;
  duration: string;
  location: string;
  status: "open" | "upcoming" | "waitlist";
}

export interface TrainingProcessStep {
  number: string;
  title: string;
  description: string;

  /**
   * Retained so existing CMS documents and the admin editor keep working, but
   * no longer rendered: the redesign carries weight through colour, shape,
   * type and spacing rather than iconography. Optional so new code does not
   * have to invent a value for a field nothing displays.
   */
  icon?: string;
  iconImage?: string;
}

export interface TrainingAudienceCard {
  title: string;
  description: string;
  bullets: string[];
}

export interface TrainingTimelineItem {
  label: string;
  title: string;
  description: string;
}

export interface TrainingLandingContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  routeCards: RouteCard[];
  focusAreas: TrainingFocusCard[];
  supportPoints: string[];
  cohorts: TrainingCohort[];
  process: TrainingProcessStep[];
}

export interface TrainingCatalogContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  highlights: string[];
  cohorts: TrainingCohort[];
  process: TrainingProcessStep[];
  // Optional section copy for page headings
  cohortsSectionEyebrow?: string;
  cohortsSectionTitle?: string;
  cohortsSectionDescription?: string;
  processSectionEyebrow?: string;
  processSectionTitle?: string;
  processSectionDescription?: string;
}

export interface TrainingEligibilityContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  audienceCards: TrainingAudienceCard[];
  readinessPoints: string[];
  nextSteps: RouteCard[];
  // Optional section copy to avoid hardcoded strings in pages
  practiceEyebrow?: string; // e.g. "In practice"
  practiceNotes?: string[];
  profilesSectionEyebrow?: string; // e.g. "Learner profiles"
  profilesSectionTitle?: string;
  profilesSectionDescription?: string;
  readinessSectionEyebrow?: string; // e.g. "What helps"
  readinessSectionTitle?: string;
  readinessSectionDescription?: string;
  nextStepsSectionEyebrow?: string;
  nextStepsSectionTitle?: string;
  nextStepsSectionDescription?: string;
}

export interface TrainingHowItWorksContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  process: TrainingProcessStep[];
  timeline: TrainingTimelineItem[];
  checklist: string[];
  nextSteps: RouteCard[];
  // Optional section copy to avoid hardcoded strings in pages
  heroAsideEyebrow?: string; // e.g. "Why this matters"
  heroAsideText?: string;
  processSectionEyebrow?: string;
  processSectionTitle?: string;
  processSectionDescription?: string;
  timelineSectionEyebrow?: string;
  timelineSectionTitle?: string;
  timelineSectionDescription?: string;
  prepareSectionEyebrow?: string;
  prepareSectionTitle?: string;
  prepareSectionDescription?: string;
  nextStepsSectionEyebrow?: string;
  nextStepsSectionTitle?: string;
  nextStepsSectionDescription?: string;
}

export interface OrganisationOverviewCard {
  title: string;
  description: string;
}

export interface OrganisationServiceCard {
  title: string;
  description: string;
  icon: string;
  // Optional image URL alternative to icon
  iconImage?: string;
  // Full card photo support
  image?: string;
  imageAlt?: string;
  bullets: string[];
}

export interface OrganisationProcessStep {
  number: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  icon: string;
  // Optional image URL alternative to icon
  iconImage?: string;
}

export interface OrganisationCaseStudy {
  title: string;
  organisationType: string;
  summary: string;
  outcome: string;
  highlight: string;
}

export interface OrganisationPackage {
  name: string;
  price: string;
  description: string;
  features: string[];
  note?: string;
}

export interface OrganisationFaq {
  question: string;
  answer: string;
}

export interface OrganisationContactCta {
  heading: string;
  description: string;
  email: string;
  primary: ActionLink;
  secondary: ActionLink;
}

export interface OrganisationServicePage {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  tagline: string;
  heroImage: string;
  stats: HighlightStat[];
  overviewCards: OrganisationServiceCard[];
  howItWorks: OrganisationProcessStep[];
  caseStudies: OrganisationCaseStudy[];
  pricingHeadline?: string;
  pricingDescription?: string;
  packages?: OrganisationPackage[];
  faqs: OrganisationFaq[];
  contactCta: OrganisationContactCta;
  related: RouteCard[];
  // Optional section labels to avoid hardcoded UI copy
  snapshotEyebrow?: string; // e.g. "Service snapshot"
  overviewSectionEyebrow?: string;
  overviewSectionTitle?: string;
  overviewSectionDescription?: string;
  overviewCardBadgeLabel?: string; // e.g. "Service area"
  howItWorksSectionEyebrow?: string;
  howItWorksSectionTitle?: string;
  howItWorksSectionDescription?: string;
  caseStudiesSectionEyebrow?: string;
  caseStudiesSectionTitle?: string;
  caseStudiesSectionDescription?: string;
  packagesSectionEyebrow?: string;
  faqsSectionEyebrow?: string;
  faqsSectionTitle?: string;
  faqsSectionDescription?: string;
  contactSectionEyebrow?: string;
  relatedSectionEyebrow?: string;
  relatedSectionTitle?: string;
  relatedSectionDescription?: string;
}

export interface OrganisationOverviewContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  /** Optional: feature a video in the overview alongside text */
  overviewVideoUrl?: string;
  overviewVideoTitle?: string;
  valueCards: OrganisationOverviewCard[];
  engagementCards: OrganisationOverviewCard[];
  nextSteps: RouteCard[];
  // Optional section copy to avoid hardcoded text in the overview page
  overviewSectionEyebrow?: string;
  overviewSectionTitle?: string;
  overviewSectionDescription?: string;
  servicesSectionEyebrow?: string;
  servicesSectionTitle?: string;
  servicesSectionDescription?: string;
  engagementSectionEyebrow?: string;
  engagementSectionTitle?: string;
  engagementSectionDescription?: string;
  nextStepsSectionEyebrow?: string;
  nextStepsSectionTitle?: string;
  nextStepsSectionDescription?: string;
}

export interface PartnershipOverviewCard {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface PartnershipFocusCard {
  title: string;
  description: string;
  icon: string;
  // Optional image URL alternative to icon
  iconImage?: string;
  // Full card photo support
  image?: string;
  imageAlt?: string;
  bullets: string[];
}

export interface PartnershipProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
  // Optional image URL alternative to icon
  iconImage?: string;
}

export interface PartnershipScenario {
  title: string;
  partnerType: string;
  summary: string;
  outcome: string;
  highlight: string;
}

export interface PartnershipFaq {
  question: string;
  answer: string;
}

export interface PartnershipContactCta {
  heading: string;
  description: string;
  email: string;
  primary: ActionLink;
  secondary: ActionLink;
}

export interface PartnershipTrackPage {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  tagline: string;
  heroImage: string;
  stats: HighlightStat[];
  focusCards: PartnershipFocusCard[];
  howItWorks: PartnershipProcessStep[];
  scenarios: PartnershipScenario[];
  faqs: PartnershipFaq[];
  contactCta: PartnershipContactCta;
  related: RouteCard[];
  // Optional section copy to avoid hardcoded UI strings
  snapshotEyebrow?: string; // e.g. "Partnership snapshot"
  overviewSectionEyebrow?: string;
  overviewSectionTitle?: string;
  overviewSectionDescription?: string;
  overviewCardBadgeLabel?: string; // e.g. "Focus area"
  howItWorksSectionEyebrow?: string;
  howItWorksSectionTitle?: string;
  howItWorksSectionDescription?: string;
  scenariosSectionEyebrow?: string;
  scenariosSectionTitle?: string;
  scenariosSectionDescription?: string;
  faqsSectionEyebrow?: string;
  faqsSectionTitle?: string;
  faqsSectionDescription?: string;
  contactSectionEyebrow?: string;
  relatedSectionEyebrow?: string;
  relatedSectionTitle?: string;
  relatedSectionDescription?: string;
  // Optional media for overview section
  overviewVideoUrl?: string;
  overviewVideoTitle?: string;
}

export interface PartnershipOverviewContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  valueCards: PartnershipOverviewCard[];
  partnerTypeCards: PartnershipOverviewCard[];
  nextSteps: RouteCard[];
  // Optional section copy to avoid hardcoded UI strings
  overviewSectionEyebrow?: string;
  overviewSectionTitle?: string;
  overviewSectionDescription?: string;
  tracksSectionEyebrow?: string;
  tracksSectionTitle?: string;
  tracksSectionDescription?: string;
  partnerTypesSectionEyebrow?: string;
  partnerTypesSectionTitle?: string;
  partnerTypesSectionDescription?: string;
  nextStepsSectionEyebrow?: string;
  nextStepsSectionTitle?: string;
  nextStepsSectionDescription?: string;
  // Optional media for overview section
  overviewVideoUrl?: string;
  overviewVideoTitle?: string;
}

export interface WhatWeDoHeroStatLabel {
  label: string;
  description: string;
}

export interface EcosystemCardContent {
  eyebrow: string;
  title: string;
  description: string;
  // Optional image support
  image?: string;
  imageAlt?: string;
}

export interface PathwayCardContent {
  title: string;
  description: string;

  /**
   * Slugs of the initiatives this stage holds.
   *
   * The grouping previously existed only inside the description prose, which
   * meant the page could describe the pathway but never show its structure.
   * Optional so existing documents keep working; a stage with no slugs simply
   * renders without branches.
   */
  initiativeSlugs?: string[];
}

export interface WhatWeDoGalleryItem {
  type: "image" | "video";
  url: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface WhatWeDoOverviewContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  heroStats: WhatWeDoHeroStatLabel[]; // order aligns with computed values
  // Sections
  overviewSectionEyebrow?: string;
  overviewSectionTitle?: string;
  overviewSectionDescription?: string;
  ecosystemCards: EcosystemCardContent[];
  initiativesSectionEyebrow?: string;
  initiativesSectionTitle?: string;
  initiativesSectionDescription?: string;
  gallerySectionEyebrow?: string;
  gallerySectionTitle?: string;
  gallerySectionDescription?: string;
  galleryItems: WhatWeDoGalleryItem[];
  pathwaysSectionEyebrow?: string;
  pathwaysSectionTitle?: string;
  pathwaysSectionDescription?: string;
  pathwayCards: PathwayCardContent[];
  nextStepsSectionEyebrow?: string;
  nextStepsSectionTitle?: string;
  nextStepsSectionDescription?: string;
  nextSteps: RouteCard[];
}

export interface ImpactEvidenceCard {
  title: string;
  description: string;
  icon: string;
  // Optional image URL alternative to icon
  iconImage?: string;
  // Full card photo support
  image?: string;
  imageAlt?: string;
  bullets: string[];
}

export interface ImpactReportResource {
  id: string;
  year: string;
  title: string;
  summary: string;
  href: string;
  fileLabel: string;
  highlights: string[];
}

export interface ImpactFeaturedStory {
  label: string;
  headline: string;
  quote: string;
  name: string;
  role: string;
  programme: string;
  backgroundImage: string;
  videoUrl?: string;
  primaryCtaLabel: string;
  secondaryCta: ActionLink;
}

export interface ImpactStory {
  id: string;
  title: string;
  quote: string;
  name: string;
  role: string;
  programme: string;
  year: string;
  theme: string;
  image?: string;
  format: "written" | "video" | "partner";
}

export interface ImpactSdgGoal {
  goal: string;
  title: string;
  summary: string;
  icon: string;
  // Optional image URL alternative to icon
  iconImage?: string;
  contributions: string[];
  linkedRoutes: RouteCard[];
}

export interface ImpactOverviewContent {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  heroImage: string;
  stats: HighlightStat[];
  measurementCards: ImpactEvidenceCard[];
  proofPoints: string[];
  routeCards: RouteCard[];
  // Optional section copy to avoid hardcoded UI strings
  heroAsideEyebrow?: string;
  snapshotSectionEyebrow?: string;
  snapshotSectionTitle?: string;
  snapshotSectionDescription?: string;
  measurementSectionEyebrow?: string;
  measurementSectionTitle?: string;
  measurementSectionDescription?: string;
  measurementCardBadgeLabel?: string;
  routesSectionEyebrow?: string;
  routesSectionTitle?: string;
  routesSectionDescription?: string;
  partnersHeading?: string;
}

export interface ImpactReportsContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  reportResources: ImpactReportResource[];
  evidenceCards: ImpactEvidenceCard[];
  methodologyPoints: string[];
  related: RouteCard[];
  // Optional media to strengthen the "Reading the evidence" section
  methodVideoUrl?: string;
  methodVideoTitle?: string;
  // Optional section copy to avoid hardcoded UI strings
  heroAsideEyebrow?: string;
  snapshotSectionEyebrow?: string;
  snapshotSectionTitle?: string;
  snapshotSectionDescription?: string;
  reportsSectionEyebrow?: string;
  reportsSectionTitle?: string;
  reportsSectionDescription?: string;
  reportBadgeLabel?: string;
  methodSectionEyebrow?: string;
  methodSectionTitle?: string;
  methodSectionDescription?: string;
  methodBadgeEyebrow?: string;
  methodCardBadgeLabel?: string;
  nextStepsSectionEyebrow?: string;
  nextStepsSectionTitle?: string;
  nextStepsSectionDescription?: string;
}

export interface ImpactTestimonialsContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  featuredStory: ImpactFeaturedStory;
  stories: ImpactStory[];
  themes: string[];
  related: RouteCard[];
  // Optional section copy to avoid hardcoded UI strings
  heroAsideEyebrow?: string;
  listSectionEyebrow?: string;
  listSectionTitle?: string;
  listSectionDescription?: string;
  nextStepsSectionEyebrow?: string;
  nextStepsSectionTitle?: string;
  nextStepsSectionDescription?: string;
}

export interface ImpactSdgsContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  goals: ImpactSdgGoal[];
  alignmentPrinciples: string[];
  related: RouteCard[];
  // Optional section copy to avoid hardcoded UI strings
  heroAsideEyebrow?: string;
  snapshotSectionEyebrow?: string;
  snapshotSectionTitle?: string;
  snapshotSectionDescription?: string;
  goalsSectionEyebrow?: string;
  goalsSectionTitle?: string;
  goalsSectionDescription?: string;
  principlesSectionEyebrow?: string;
  principlesSectionTitle?: string;
  principlesSectionDescription?: string;
  // Optional media to strengthen the principles section
  principlesVideoUrl?: string;
  principlesVideoTitle?: string;
  nextStepsSectionEyebrow?: string;
  nextStepsSectionTitle?: string;
  nextStepsSectionDescription?: string;
}

export type ContactEnquiryType =
  | "training"
  | "organisation"
  | "partnership"
  | "donation"
  | "media"
  | "volunteering"
  | "general";

export type PreferredContactMethod = "email" | "phone" | "either";

export interface ContactChannel {
  label: string;
  value: string;
  description: string;
  href: string;
}

export interface ContactEnquiryOption {
  /** Optional: video in the hero area */
  heroVideoUrl?: string;
  heroVideoThumbnail?: string;
  value: ContactEnquiryType;
  label: string;
  description: string;
}

export interface ContactResponseStep {
  number: string;
  title: string;
  description: string;
}

export interface ContactPageContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  channels: ContactChannel[];
  enquiryOptions: ContactEnquiryOption[];
  responseSteps: ContactResponseStep[];
  routeCards: RouteCard[];
  privacyNote: string;
  channelsEyebrow?: string;
  channelsTitle?: string;
  channelsDescription?: string;
  formEyebrow?: string;
  formTitle?: string;
  formDescription?: string;
  messageEyebrow?: string;
  messageTitle?: string;
  messageDescription?: string;
  privacyTitle?: string;
  routesEyebrow?: string;
  routesTitle?: string;
  routesDescription?: string;
  emailCtaLabel?: string;
  formCtaLabel?: string;
}
