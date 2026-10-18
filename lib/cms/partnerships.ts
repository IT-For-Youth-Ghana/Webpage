import { partnershipOverviewContent as seedOverview, partnershipTracks as seedTracks } from "@/lib/content/partnership-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { PartnershipOverviewContent, PartnershipTrackPage } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

const OVERVIEW_ID = "_overview";

function normalizeObject<T extends object>(fallback: T, data: Record<string, unknown> | undefined): T {
  return { ...fallback, ...(data ?? {}) } as T;
}

export async function getCmsPartnershipOverview(): Promise<PartnershipOverviewContent> {
  const db = await getAdminFirestore();
  if (!db) return seedOverview;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(OVERVIEW_ID).get();
    if (!doc.exists) return seedOverview;
    return normalizeObject(seedOverview, (doc.data() ?? {}) as Record<string, unknown>);
  } catch (e) {
    console.error("Partnership overview read failed. Falling back to seed.", e);
    return seedOverview;
  }
}

function normalizeTrack(slug: string, data: Record<string, unknown> | undefined): PartnershipTrackPage {
  const fallback = seedTracks.find((t) => t.slug === slug) ?? seedTracks[0]!;
  return normalizeObject(fallback, data ?? {});
}

export async function getCmsPartnershipTracks(): Promise<PartnershipTrackPage[]> {
  const db = await getAdminFirestore();
  if (!db) return seedTracks;
  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.partnerships).get();
    const docs = snapshot.docs.filter((d) => d.id !== OVERVIEW_ID);
    if (!docs.length) return seedTracks;
    const tracks = docs.map((doc) => normalizeTrack(doc.id, doc.data() as Record<string, unknown>));
    // Keep the seed order by mapping over seed slugs
    const order = new Map(seedTracks.map((t, i) => [t.slug, i] as const));
    return [...tracks].sort((a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999));
  } catch (e) {
    console.error("Partnership tracks read failed. Falling back to seed.", e);
    return seedTracks;
  }
}

export async function getCmsPartnershipTrackBySlug(slug: string): Promise<PartnershipTrackPage | undefined> {
  const db = await getAdminFirestore();
  if (!db) return seedTracks.find((t) => t.slug === slug);
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(slug).get();
    if (!doc.exists) return seedTracks.find((t) => t.slug === slug);
    return normalizeTrack(slug, doc.data() as Record<string, unknown>);
  } catch (e) {
    console.error("Partnership track read failed. Falling back to seed.", e);
    return seedTracks.find((t) => t.slug === slug);
  }
}

export async function saveCmsPartnershipTrack(slug: string, payload: Partial<PartnershipTrackPage>) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(slug).set(
    { slug, ...(payload as Record<string, unknown>), updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  return { configured: true, written: true, id: slug } as const;
}

export async function deleteCmsPartnershipTrack(slug: string) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(slug).delete();
  return { configured: true, written: true, id: slug } as const;
}

export async function saveCmsPartnershipOverview(payload: Partial<PartnershipOverviewContent>) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(OVERVIEW_ID).set(
    { ...(payload as Record<string, unknown>), updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  return { configured: true, written: true, id: OVERVIEW_ID } as const;
}
