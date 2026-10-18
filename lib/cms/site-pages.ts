import {
  applyForTrainingHub,
  careersHub,
  howItWorksHub,
  initiatives,
  partnersHub,
  teamHub,
  testimonialsHub,
  trainingCoursesHub,
  whoCanApplyHub,
  whoWeAreHub,
} from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { DynamicSitePagePayload, SitePagePayload } from "@/lib/utils/validators";
import type { DynamicSitePage, DynamicSitePageStatus, SitePage } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

const pageFallbacks: Record<string, SitePage> = {
  "who-we-are": whoWeAreHub,
  "apply-for-training": applyForTrainingHub,
  "apply-for-training-who-can-apply": whoCanApplyHub,
  "apply-for-training-how-it-works": howItWorksHub,
  "apply-for-training-courses": trainingCoursesHub,
  team: teamHub,
  partners: partnersHub,
  careers: careersHub,
  testimonials: testimonialsHub,
};

const pageLabels: Record<string, string> = {
  "who-we-are": "Who We Are",
  "apply-for-training": "Apply for Training",
  "apply-for-training-who-can-apply": "Who Can Apply",
  "apply-for-training-how-it-works": "How It Works",
  "apply-for-training-courses": "Training Courses",
  team: "Team",
  partners: "Partners",
  careers: "Careers",
  testimonials: "Testimonials",
};

const WHO_WE_ARE_DYNAMIC_PARENT = "who-we-are";
const WHO_WE_ARE_DYNAMIC_TYPE = "whoWeAreDynamicPage";
const RESERVED_WHO_WE_ARE_SLUGS = new Set(["team", "partners", "careers"]);
const WHAT_WE_DO_DYNAMIC_PARENT = "what-we-do";
const WHAT_WE_DO_DYNAMIC_TYPE = "whatWeDoDynamicPage";
const RESERVED_WHAT_WE_DO_SLUGS = new Set(initiatives.map((initiative) => initiative.slug));

/**
 * Every optional string on SitePage that mergeSitePage copies out of Firestore.
 *
 * A field missing from this list is dropped on read even when Firestore holds a
 * value, which is how heroImageAlt, heroVideoUrl and heroVideoThumbnail became
 * write-only. lib/cms/site-pages-contract.test.ts fails when this list and the
 * string fields of sitePageSchema drift apart in either direction.
 */
const optionalStringFields = [
  "heroImage",
  "heroImageAlt",
  "heroVideoUrl",
  "heroVideoThumbnail",
  "overviewTitle",
  "overviewDescription",
  "operatingEyebrow",
  "operatingTitle",
  "operatingDescription",
  "principlesEyebrow",
  "principlesTitle",
  "principlesDescription",
  "principlesHeroEyebrow",
  "principlesHeroTitle",
  "principlesImage",
  "principlesImageAlt",
  "highlightsEyebrow",
  "exploreEyebrow",
  "exploreTitle",
  "exploreDescription",
  "processEyebrow",
  "processTitle",
  "processDescription",
  "nextStepEyebrow",
  "nextStepTitle",
  "nextStepDescription",
] as const satisfies readonly (keyof SitePage)[];

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function mergeSitePage(fallback: SitePage, data: Record<string, unknown>): SitePage {
  const stats = Array.isArray(data.stats) ? data.stats : fallback.stats;
  const sections = Array.isArray(data.sections) ? data.sections : fallback.sections;
  const ctas = Array.isArray(data.ctas) ? data.ctas : fallback.ctas;
  const related = Array.isArray(data.related) ? data.related : fallback.related;
  const courses = Array.isArray(data.courses) ? data.courses : fallback.courses;
  const cohorts = Array.isArray(data.cohorts) ? data.cohorts : fallback.cohorts;
  const process = Array.isArray(data.process) ? data.process : fallback.process;
  const optionalFields = Object.fromEntries(
    optionalStringFields.map((field) => [field, asString(data[field]) ?? fallback[field]]),
  );

  return {
    slug: asString(data.slug) ?? fallback.slug,
    eyebrow: asString(data.eyebrow) ?? fallback.eyebrow,
    title: asString(data.title) ?? fallback.title,
    description: asString(data.description) ?? fallback.description,
    intro: asString(data.intro) ?? fallback.intro,
    stats,
    sections,
    ctas,
    related,
    courses,
    cohorts,
    process,
    ...optionalFields,
  };
}

function emptyDynamicWhoWeArePage(slug = ""): DynamicSitePage {
  return {
    id: slug,
    parentSlug: WHO_WE_ARE_DYNAMIC_PARENT,
    slug,
    eyebrow: "Who We Are",
    title: "",
    description: "",
    intro: "",
    heroImage: "",
    stats: [
      {
        value: "",
        label: "",
        description: "",
      },
    ],
    sections: [
      {
        title: "",
        body: "",
        bullets: [],
      },
    ],
    ctas: [],
    related: [],
    status: "draft",
    order: 0,
  };
}

function emptyDynamicWhatWeDoPage(slug = ""): DynamicSitePage {
  return {
    id: slug,
    parentSlug: WHAT_WE_DO_DYNAMIC_PARENT,
    slug,
    eyebrow: "What We Do",
    title: "",
    description: "",
    intro: "",
    heroImage: "",
    stats: [
      {
        value: "",
        label: "",
        description: "",
      },
    ],
    sections: [
      {
        title: "",
        body: "",
        bullets: [],
      },
    ],
    ctas: [],
    related: [],
    status: "draft",
    order: 0,
  };
}

function normalizeStatus(value: unknown): DynamicSitePageStatus {
  return value === "published" || value === "archived" || value === "draft" ? value : "draft";
}

function normalizeDynamicSitePage(id: string, data: Record<string, unknown>): DynamicSitePage {
  const fallback = emptyDynamicWhoWeArePage(asString(data.slug) ?? id);
  const page = mergeSitePage(fallback, data);

  return {
    ...page,
    id,
    parentSlug: asString(data.parentSlug) ?? WHO_WE_ARE_DYNAMIC_PARENT,
    status: normalizeStatus(data.status),
    order: typeof data.order === "number" ? data.order : 0,
  };
}

function sortDynamicPages(pages: DynamicSitePage[]) {
  return [...pages].sort((left, right) => {
    const order = left.order - right.order;
    if (order !== 0) {
      return order;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function getCmsSitePage(slug: string): Promise<SitePage | null> {
  const fallback = pageFallbacks[slug];

  if (!fallback) {
    return null;
  }

  const db = await getAdminFirestore();

  if (!db) {
    return fallback;
  }

  try {
    const directDoc = await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(slug).get();

    if (directDoc.exists) {
      return mergeSitePage(fallback, directDoc.data() ?? {});
    }

    const slugMatch = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (slugMatch.empty) {
      return fallback;
    }

    return mergeSitePage(fallback, slugMatch.docs[0].data());
  } catch (error) {
    console.error("Firestore site-content read failed. Falling back to seed content.", error);
    return fallback;
  }
}

export function getEmptyWhoWeAreDynamicPage(slug = ""): DynamicSitePage {
  return emptyDynamicWhoWeArePage(slug);
}

export function getEmptyWhatWeDoDynamicPage(slug = ""): DynamicSitePage {
  return emptyDynamicWhatWeDoPage(slug);
}

export function isReservedWhoWeAreSlug(slug: string) {
  return RESERVED_WHO_WE_ARE_SLUGS.has(slug);
}

export function isReservedWhatWeDoSlug(slug: string) {
  return RESERVED_WHAT_WE_DO_SLUGS.has(slug);
}

export async function getCmsWhoWeAreDynamicPages(
  includeUnpublished = false,
): Promise<DynamicSitePage[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return [];
  }

  try {
    const snapshot = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .where("parentSlug", "==", WHO_WE_ARE_DYNAMIC_PARENT)
      .get();

    let pages = snapshot.docs
      .map((doc) => normalizeDynamicSitePage(doc.id, doc.data() ?? {}))
      .filter((page) => page.parentSlug === WHO_WE_ARE_DYNAMIC_PARENT);

    pages = pages.filter((page) => !RESERVED_WHO_WE_ARE_SLUGS.has(page.slug));

    if (!includeUnpublished) {
      pages = pages.filter((page) => page.status === "published");
    }

    return sortDynamicPages(pages);
  } catch (error) {
    console.error("Firestore Who We Are dynamic-page read failed.", error);
    return [];
  }
}

export async function getCmsWhatWeDoDynamicPages(
  includeUnpublished = false,
): Promise<DynamicSitePage[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return [];
  }

  try {
    const snapshot = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .where("parentSlug", "==", WHAT_WE_DO_DYNAMIC_PARENT)
      .get();

    let pages = snapshot.docs
      .map((doc) => normalizeDynamicSitePage(doc.id, doc.data() ?? {}))
      .filter((page) => page.parentSlug === WHAT_WE_DO_DYNAMIC_PARENT);

    pages = pages.filter((page) => !RESERVED_WHAT_WE_DO_SLUGS.has(page.slug));

    if (!includeUnpublished) {
      pages = pages.filter((page) => page.status === "published");
    }

    return sortDynamicPages(pages);
  } catch (error) {
    console.error("Firestore What We Do dynamic-page read failed.", error);
    return [];
  }
}

export async function getCmsWhoWeAreDynamicPageBySlug(
  slug: string,
  includeUnpublished = false,
): Promise<DynamicSitePage | null> {
  if (RESERVED_WHO_WE_ARE_SLUGS.has(slug)) {
    return null;
  }

  const db = await getAdminFirestore();

  if (!db) {
    return null;
  }

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .doc(`who-we-are-${slug}`)
      .get();

    if (!doc.exists) {
      return null;
    }

    const page = normalizeDynamicSitePage(doc.id, doc.data() ?? {});

    if (!includeUnpublished && page.status !== "published") {
      return null;
    }

    return page;
  } catch (error) {
    console.error("Firestore Who We Are dynamic-page lookup failed.", error);
    return null;
  }
}

export async function getCmsWhatWeDoDynamicPageBySlug(
  slug: string,
  includeUnpublished = false,
): Promise<DynamicSitePage | null> {
  if (RESERVED_WHAT_WE_DO_SLUGS.has(slug)) {
    return null;
  }

  const db = await getAdminFirestore();

  if (!db) {
    return null;
  }

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .doc(`what-we-do-${slug}`)
      .get();

    if (!doc.exists) {
      return null;
    }

    const page = normalizeDynamicSitePage(doc.id, doc.data() ?? {});

    if (!includeUnpublished && page.status !== "published") {
      return null;
    }

    return page;
  } catch (error) {
    console.error("Firestore What We Do dynamic-page lookup failed.", error);
    return null;
  }
}

export async function saveCmsWhoWeAreDynamicPage(
  payload: DynamicSitePagePayload,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  const id = `who-we-are-${payload.slug}`;

  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(id).set(
    {
      ...payload,
      parentSlug: WHO_WE_ARE_DYNAMIC_PARENT,
      type: WHO_WE_ARE_DYNAMIC_TYPE,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    configured: true,
    written: true,
    id,
  };
}

export async function saveCmsWhatWeDoDynamicPage(
  payload: DynamicSitePagePayload,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  const id = `what-we-do-${payload.slug}`;

  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(id).set(
    {
      ...payload,
      parentSlug: WHAT_WE_DO_DYNAMIC_PARENT,
      type: WHAT_WE_DO_DYNAMIC_TYPE,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    configured: true,
    written: true,
    id,
  };
}

export async function deleteCmsWhoWeAreDynamicPage(slug: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(`who-we-are-${slug}`).delete();

  return {
    configured: true,
    written: true,
    id: `who-we-are-${slug}`,
  };
}

export async function deleteCmsWhatWeDoDynamicPage(slug: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(`what-we-do-${slug}`).delete();

  return {
    configured: true,
    written: true,
    id: `what-we-do-${slug}`,
  };
}

export async function getCmsWhoWeArePage(): Promise<SitePage> {
  return (await getCmsSitePage("who-we-are")) ?? whoWeAreHub;
}

export async function getCmsApplyForTrainingPage(): Promise<SitePage> {
  return (await getCmsSitePage("apply-for-training")) ?? applyForTrainingHub;
}

export async function getCmsTrainingWhoCanApplyPage(): Promise<SitePage> {
  return (await getCmsSitePage("apply-for-training-who-can-apply")) ?? whoCanApplyHub;
}

export async function getCmsTrainingHowItWorksPage(): Promise<SitePage> {
  return (await getCmsSitePage("apply-for-training-how-it-works")) ?? howItWorksHub;
}

export async function getCmsTrainingCoursesPage(): Promise<SitePage> {
  return (await getCmsSitePage("apply-for-training-courses")) ?? trainingCoursesHub;
}

export function isCmsSitePageSlug(slug: string) {
  return slug in pageFallbacks;
}

export function getCmsSitePageLabel(slug: string) {
  return pageLabels[slug] ?? "Site page";
}

export async function saveCmsSitePage(
  slug: string,
  payload: SitePagePayload,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(slug).set(
    {
      ...payload,
      slug,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    configured: true,
    written: true,
    id: slug,
  };
}
