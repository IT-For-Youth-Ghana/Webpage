import type { Testimonial } from "@/components/home/testimonials-section";
import { testimonials as seedTestimonials } from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { TestimonialPayload } from "@/lib/utils/validators";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

function toInitials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "IT";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function normalizeTestimonial(id: string, data: Record<string, unknown>): Testimonial | null {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const quote = typeof data.quote === "string" ? data.quote.trim() : "";
  const role = typeof data.role === "string" ? data.role.trim() : "";

  if (!name || !quote || !role) {
    return null;
  }

  return {
    id,
    name,
    quote,
    role,
    programme: typeof data.programme === "string" ? data.programme : undefined,
    year: typeof data.year === "string" ? data.year : undefined,
    avatar: typeof data.avatar === "string" ? data.avatar : undefined,
    initials:
      typeof data.initials === "string" && data.initials.trim().length
        ? data.initials.trim().slice(0, 3).toUpperCase()
        : toInitials(name),
    active: data.active === false ? false : true,
  };
}

function sortTestimonials(testimonials: Testimonial[]) {
  return [...testimonials].sort((left, right) => left.name.localeCompare(right.name));
}

export async function getCmsTestimonials() {
  const db = await getAdminFirestore();

  if (!db) {
    return sortTestimonials(seedTestimonials);
  }

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.testimonials).get();

    if (snapshot.empty) {
      return sortTestimonials(seedTestimonials);
    }

    const testimonials = snapshot.docs
      .map((doc) => normalizeTestimonial(doc.id, doc.data()))
      .filter((item): item is Testimonial => item !== null);

    return testimonials.length ? sortTestimonials(testimonials) : sortTestimonials(seedTestimonials);
  } catch (error) {
    console.error("Firestore testimonial read failed. Falling back to seed testimonials.", error);
    return sortTestimonials(seedTestimonials);
  }
}

export async function getCmsTestimonialById(id: string) {
  const db = await getAdminFirestore();

  if (!db) {
    return seedTestimonials.find((item) => item.id === id);
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.testimonials).doc(id).get();

    if (!doc.exists) {
      return undefined;
    }

    return normalizeTestimonial(doc.id, doc.data() ?? {}) ?? undefined;
  } catch (error) {
    console.error("Firestore testimonial lookup failed.", error);
    return seedTestimonials.find((item) => item.id === id);
  }
}

export async function saveCmsTestimonial(
  payload: TestimonialPayload,
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
    ? db.collection(FIREBASE_COLLECTIONS.testimonials).doc(id)
    : db.collection(FIREBASE_COLLECTIONS.testimonials).doc();
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
      quote: payload.quote,
      role: payload.role,
      programme: payload.programme,
      year: payload.year,
      avatar: payload.avatar,
      initials: payload.initials,
      active: payload.active ?? true,
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

export async function deleteCmsTestimonial(id: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  await db.collection(FIREBASE_COLLECTIONS.testimonials).doc(id).delete();

  return {
    configured: true,
    written: true,
    id,
  };
}
