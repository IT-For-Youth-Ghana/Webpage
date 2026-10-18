import {
  initiatives as seedInitiatives,
  whatWeDoOverviewContent as seedWhatWeDoOverviewContent,
} from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type {
  InitiativePayload,
  WhatWeDoOverviewPayload,
} from "@/lib/utils/validators";
import type { InitiativePage, WhatWeDoOverviewContent } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

const WHAT_WE_DO_OVERVIEW_DOC_ID = "what-we-do";

function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)]),
    );
  }

  return value;
}

function sortInitiatives(items: InitiativePage[]) {
  const seedOrder = new Map(seedInitiatives.map((initiative, index) => [initiative.slug, index]));

  return [...items].sort((left, right) => {
    const leftOrder = seedOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = seedOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.title.localeCompare(right.title);
  });
}

function normalizeInitiative(id: string, data: Record<string, unknown>): InitiativePage | null {
  const slug = typeof data.slug === "string" && data.slug.trim() ? data.slug.trim() : id;
  const fallback = seedInitiatives.find((initiative) => initiative.slug === slug);

  if (!fallback) {
    return null;
  }

  return {
    ...fallback,
    ...data,
    sectionContent: {
      ...fallback.sectionContent,
      ...((data.sectionContent as Partial<InitiativePage["sectionContent"]> | undefined) ?? {}),
    },
    slug,
  } as InitiativePage;
}

function normalizeOverview(data: Record<string, unknown>): WhatWeDoOverviewContent {
  return {
    ...seedWhatWeDoOverviewContent,
    ...data,
  } as WhatWeDoOverviewContent;
}

export async function getCmsWhatWeDoOverview(): Promise<WhatWeDoOverviewContent> {
  const db = await getAdminFirestore();

  if (!db) {
    return seedWhatWeDoOverviewContent;
  }

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .doc(WHAT_WE_DO_OVERVIEW_DOC_ID)
      .get();

    if (!doc.exists) {
      return seedWhatWeDoOverviewContent;
    }

    return normalizeOverview(doc.data() ?? {});
  } catch (error) {
    console.error("Firestore What We Do overview read failed. Falling back to seed content.", error);
    return seedWhatWeDoOverviewContent;
  }
}

export async function saveCmsWhatWeDoOverview(
  payload: WhatWeDoOverviewPayload,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  const docRef = db.collection(FIREBASE_COLLECTIONS.siteContent).doc(WHAT_WE_DO_OVERVIEW_DOC_ID);

  await docRef.set(
    {
      ...(stripUndefined(payload) as Record<string, unknown>),
      slug: WHAT_WE_DO_OVERVIEW_DOC_ID,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { configured: true, written: true, id: docRef.id };
}

export async function getCmsInitiatives(): Promise<InitiativePage[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return sortInitiatives(seedInitiatives);
  }

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.initiatives).get();

    if (snapshot.empty) {
      return sortInitiatives(seedInitiatives);
    }

    const cmsItems = snapshot.docs
      .map((doc) => normalizeInitiative(doc.id, doc.data() ?? {}))
      .filter((initiative): initiative is InitiativePage => initiative !== null);
    const cmsBySlug = new Map(cmsItems.map((initiative) => [initiative.slug, initiative]));
    const merged = seedInitiatives.map((seed) => cmsBySlug.get(seed.slug) ?? seed);

    return sortInitiatives(merged);
  } catch (error) {
    console.error("Firestore initiative read failed. Falling back to seed content.", error);
    return sortInitiatives(seedInitiatives);
  }
}

export async function getCmsInitiativeBySlug(slug: string): Promise<InitiativePage | undefined> {
  const initiatives = await getCmsInitiatives();
  return initiatives.find((initiative) => initiative.slug === slug);
}

export async function saveCmsInitiative(
  payload: InitiativePayload,
  id?: string,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  const docRef = db.collection(FIREBASE_COLLECTIONS.initiatives).doc(id ?? payload.slug);

  await docRef.set(
    {
      ...(stripUndefined(payload) as Record<string, unknown>),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { configured: true, written: true, id: docRef.id };
}
