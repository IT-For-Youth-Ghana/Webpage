import { heroStats as seedHeroStats } from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { HighlightStat } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

function normalizeHighlightStat(value: unknown): HighlightStat | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  const val = typeof record.value === "string" ? record.value : undefined;
  const label = typeof record.label === "string" ? record.label : undefined;

  if (!val || !label) {
    return null;
  }

  return {
    value: val,
    label,
    description: typeof record.description === "string" ? record.description : undefined,
    icon: typeof record.icon === "string" ? record.icon : undefined,
    iconImage: typeof record.iconImage === "string" ? record.iconImage : undefined,
  };
}

function asHighlightStats(input: unknown): HighlightStat[] | null {
  if (!Array.isArray(input)) {
    return null;
  }

  const mapped = input
    .map((item) => normalizeHighlightStat(item))
    .filter((item): item is HighlightStat => Boolean(item));

  return mapped.length ? mapped : null;
}

export async function getCmsImpactStats(): Promise<HighlightStat[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return seedHeroStats;
  }

  try {
    // Single doc pattern: id "main" in impactStats collection
    const doc = await db.collection(FIREBASE_COLLECTIONS.impactStats).doc("main").get();

    if (!doc.exists) {
      return seedHeroStats;
    }

    const data = doc.data() ?? {};

    // Tolerate either { stats: [...] } or an array stored directly under a key like "items"
    const statsFromStats = asHighlightStats((data as Record<string, unknown>).stats);
    const statsFromItems = asHighlightStats((data as Record<string, unknown>).items);

    if (statsFromStats && statsFromStats.length) {
      return statsFromStats;
    }

    if (statsFromItems && statsFromItems.length) {
      return statsFromItems;
    }

    // Some users may store the array directly as the entire doc payload
    const directArray = asHighlightStats(data);
    if (directArray && directArray.length) {
      return directArray;
    }

    return seedHeroStats;
  } catch (error) {
    console.error("Firestore impact-stats read failed. Falling back to seed stats.", error);
    return seedHeroStats;
  }
}
