import { getAdminFirestore } from "@/lib/firebase/admin";
import type { DocumentData } from "firebase-admin/firestore";
import {
  activeAnnouncement as seedAnnouncement,
  heroSlides as seedHeroSlides,
  homepageTicker as seedHomepageTicker,
  programmeShowcase as seedProgrammeShowcase,
  overviewSectionContent as seedOverviewSection,
  challengeSectionContent as seedChallengeSection,
  missionSectionContent as seedMissionSection,
  activeDonationCampaign as seedDonationCampaign,
  featuredStory as seedFeaturedStory,
  joinCtaCards as seedJoinCtaCards,
  newsletterSignupContent as seedNewsletterSignup,
  floatingElementsContent as seedFloatingElements,
} from "@/lib/content/site-config";
import { resolveCmsArray } from "@/lib/cms/fallback";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

// Import UI-facing types from components to keep prop compatibility
import type { Announcement } from "@/components/layout/announcement-bar";
import type { FloatingElementsContent } from "@/components/layout/floating-elements";
import type { HeroSlide } from "@/types/content";
import type { MarqueeTickerContent } from "@/components/home/marquee-ticker";
import type { ProgrammeShowcaseItem } from "@/components/home/programme-showcase";
import type { DonationCampaignContent } from "@/types/content";
import type { FeaturedStoryContent } from "@/components/home/featured-story-video";
import type { JoinCtaCard } from "@/types/content";
import type { NewsletterSignupContent } from "@/types/content";
import type { ChallengeSectionContent, MissionSectionContent, OverviewSectionContent } from "@/components/home/legacy-homepage-sections";

const DOC_ID = "main";

function getDocField<T = unknown>(
  data: Record<string, unknown> | undefined,
  path: string,
): T | undefined {
  if (!data) return undefined;
  const parts = path.split(".");
  let current: unknown = data;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current as T;
}

function getHomepageDocData(data: DocumentData | undefined) {
  return (data ?? {}) as Record<string, unknown>;
}

export async function getCmsAnnouncement(): Promise<Announcement> {
  const db = await getAdminFirestore();
  if (!db) return seedAnnouncement;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const data = (doc.data() ?? {}) as Record<string, unknown>;
    const raw = (getDocField<Record<string, unknown>>(data, "announcement") ?? data) as Record<string, unknown>;

    return {
      id: String(raw.id ?? seedAnnouncement.id),
      variant: (raw.variant as Announcement["variant"]) ?? seedAnnouncement.variant,
      label: String(raw.label ?? seedAnnouncement.label),
      message: String(raw.message ?? seedAnnouncement.message),
      cta:
        raw.cta && typeof raw.cta === "object"
          ? {
              label: String((raw.cta as Record<string, unknown>).label ?? seedAnnouncement.cta?.label ?? "Learn more"),
              href: String((raw.cta as Record<string, unknown>).href ?? seedAnnouncement.cta?.href ?? "/"),
            }
          : seedAnnouncement.cta,
      startDate: String(raw.startDate ?? seedAnnouncement.startDate ?? ""),
      endDate: String(raw.endDate ?? seedAnnouncement.endDate ?? ""),
      countdownDate: String(raw.countdownDate ?? seedAnnouncement.countdownDate ?? ""),
      dismissible: Boolean(raw.dismissible ?? seedAnnouncement.dismissible ?? true),
    };
  } catch (e) {
    console.error("Homepage announcement read failed.", e);
    return seedAnnouncement;
  }
}

export async function getCmsHeroSlides(): Promise<HeroSlide[]> {
  const db = await getAdminFirestore();
  if (!db) return seedHeroSlides;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const raw = getDocField<unknown[]>(getHomepageDocData(doc.data()), "heroSlides");
    return resolveCmsArray<HeroSlide>(raw, seedHeroSlides);
  } catch (e) {
    console.error("Homepage heroSlides read failed.", e);
    return seedHeroSlides;
  }
}

export async function getCmsHomepageTicker(): Promise<MarqueeTickerContent> {
  const db = await getAdminFirestore();
  if (!db) return seedHomepageTicker;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const ticker = getDocField<MarqueeTickerContent>(getHomepageDocData(doc.data()), "ticker");
    return ticker ?? seedHomepageTicker;
  } catch (e) {
    console.error("Homepage ticker read failed.", e);
    return seedHomepageTicker;
  }
}

export async function getCmsProgrammeShowcase(): Promise<ProgrammeShowcaseItem[]> {
  const db = await getAdminFirestore();
  if (!db) return seedProgrammeShowcase;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const raw = getDocField<unknown[]>(getHomepageDocData(doc.data()), "programmeShowcase");
    return resolveCmsArray<ProgrammeShowcaseItem>(raw, seedProgrammeShowcase);
  } catch (e) {
    console.error("Homepage programmeShowcase read failed.", e);
    return seedProgrammeShowcase;
  }
}

export async function getCmsOverviewSection(): Promise<OverviewSectionContent> {
  const db = await getAdminFirestore();
  if (!db) return seedOverviewSection;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const content = getDocField<OverviewSectionContent>(getHomepageDocData(doc.data()), "overviewSection");
    return content ?? seedOverviewSection;
  } catch (e) {
    console.error("Homepage overviewSection read failed.", e);
    return seedOverviewSection;
  }
}

export async function getCmsChallengeSection(): Promise<ChallengeSectionContent> {
  const db = await getAdminFirestore();
  if (!db) return seedChallengeSection;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const content = getDocField<ChallengeSectionContent>(getHomepageDocData(doc.data()), "challengeSection");
    return content ?? seedChallengeSection;
  } catch (e) {
    console.error("Homepage challengeSection read failed.", e);
    return seedChallengeSection;
  }
}

export async function getCmsMissionSection(): Promise<MissionSectionContent> {
  const db = await getAdminFirestore();
  if (!db) return seedMissionSection;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const content = getDocField<MissionSectionContent>(getHomepageDocData(doc.data()), "missionSection");
    return content ?? seedMissionSection;
  } catch (e) {
    console.error("Homepage missionSection read failed.", e);
    return seedMissionSection;
  }
}

export async function getCmsDonationCampaign(): Promise<DonationCampaignContent> {
  const db = await getAdminFirestore();
  if (!db) return seedDonationCampaign;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const campaign = getDocField<DonationCampaignContent>(getHomepageDocData(doc.data()), "donationCampaign");
    return campaign ?? seedDonationCampaign;
  } catch (e) {
    console.error("Homepage donationCampaign read failed.", e);
    return seedDonationCampaign;
  }
}

export async function getCmsFeaturedStory(): Promise<FeaturedStoryContent> {
  const db = await getAdminFirestore();
  if (!db) return seedFeaturedStory;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const story = getDocField<FeaturedStoryContent>(getHomepageDocData(doc.data()), "featuredStory");
    return story ?? seedFeaturedStory;
  } catch (e) {
    console.error("Homepage featuredStory read failed.", e);
    return seedFeaturedStory;
  }
}

export async function getCmsJoinCtaCards(): Promise<JoinCtaCard[]> {
  const db = await getAdminFirestore();
  if (!db) return seedJoinCtaCards;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const raw = getDocField<unknown[]>(getHomepageDocData(doc.data()), "joinCtaCards");
    return resolveCmsArray<JoinCtaCard>(raw, seedJoinCtaCards);
  } catch (e) {
    console.error("Homepage joinCtaCards read failed.", e);
    return seedJoinCtaCards;
  }
}

export async function getCmsNewsletterSignup(): Promise<NewsletterSignupContent> {
  const db = await getAdminFirestore();
  if (!db) return seedNewsletterSignup;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const content = getDocField<NewsletterSignupContent>(getHomepageDocData(doc.data()), "newsletterSignup");
    return content ?? seedNewsletterSignup;
  } catch (e) {
    console.error("Homepage newsletterSignup read failed.", e);
    return seedNewsletterSignup;
  }
}

export async function getCmsFloatingElements(): Promise<FloatingElementsContent> {
  const db = await getAdminFirestore();
  if (!db) return seedFloatingElements;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.homepage).doc(DOC_ID).get();
    const content = getDocField<FloatingElementsContent>(getHomepageDocData(doc.data()), "floatingElements");
    return content ?? seedFloatingElements;
  } catch (e) {
    console.error("Homepage floatingElements read failed.", e);
    return seedFloatingElements;
  }
}
