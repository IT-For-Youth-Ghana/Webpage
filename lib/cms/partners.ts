import type { Partner } from "@/components/home/patrners-strip";
import { partners as seedPartners } from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { PartnerPayload } from "@/lib/utils/validators";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

function normalizePartner(id: string, data: Record<string, unknown>): Partner | null {
  const name = typeof data.name === "string" ? data.name.trim() : "";

  if (!name) {
    return null;
  }

  return {
    id,
    name,
    logo: typeof data.logo === "string" ? data.logo : undefined,
    href: typeof data.href === "string" ? data.href : undefined,
    active: data.active === false ? false : true,
    order: typeof data.order === "number" ? data.order : 0,
  };
}

function sortPartners(partners: Partner[]) {
  return [...partners].sort((left, right) => {
    const ord = (left.order ?? 0) - (right.order ?? 0);
    if (ord !== 0) return ord;
    return left.name.localeCompare(right.name);
  });
}

export async function getCmsPartners() {
  const db = await getAdminFirestore();

  if (!db) {
    return sortPartners(seedPartners);
  }

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.partners).get();

    if (snapshot.empty) {
      return sortPartners(seedPartners);
    }

    const partners = snapshot.docs
      .map((doc) => normalizePartner(doc.id, doc.data()))
      .filter((partner): partner is Partner => partner !== null);

    return partners.length ? sortPartners(partners) : sortPartners(seedPartners);
  } catch (error) {
    console.error("Firestore partner read failed. Falling back to seed partners.", error);
    return sortPartners(seedPartners);
  }
}

export async function getCmsPartnerById(id: string) {
  const db = await getAdminFirestore();

  if (!db) {
    return seedPartners.find((partner) => partner.id === id);
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.partners).doc(id).get();

    if (!doc.exists) {
      return undefined;
    }

    return normalizePartner(doc.id, doc.data() ?? {}) ?? undefined;
  } catch (error) {
    console.error("Firestore partner lookup failed.", error);
    return seedPartners.find((partner) => partner.id === id);
  }
}

export async function saveCmsPartner(
  payload: PartnerPayload,
  id?: string,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const docRef = id
    ? db.collection(FIREBASE_COLLECTIONS.partners).doc(id)
    : db.collection(FIREBASE_COLLECTIONS.partners).doc();
  const { FieldValue } = await import("firebase-admin/firestore");
  const timestamps = id
    ? { updatedAt: FieldValue.serverTimestamp() }
    : {
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

  await docRef.set(
    {
      name: payload.name,
      logo: payload.logo,
      href: payload.href,
      active: payload.active ?? true,
      order: typeof payload.order === "number" ? payload.order : 0,
      ...timestamps,
    },
    { merge: true },
  );

  return {
    configured: true,
    written: true,
    id: docRef.id,
  };
}

export async function deleteCmsPartner(id: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  await db.collection(FIREBASE_COLLECTIONS.partners).doc(id).delete();

  return {
    configured: true,
    written: true,
    id,
  };
}
