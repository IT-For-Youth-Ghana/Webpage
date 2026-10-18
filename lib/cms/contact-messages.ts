import { getAdminFirestore } from "@/lib/firebase/admin";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export type CmsContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  enquiryType: string;
  preferredContact?: string;
  message: string;
  status: "new" | "reviewed" | "archived";
  createdAt?: string;
};

export async function getCmsContactMessages(): Promise<CmsContactMessage[]> {
  const db = await getAdminFirestore();
  if (!db) return [];
  const snapshot = await db.collection(FIREBASE_COLLECTIONS.contactMessages).get();
  return snapshot.docs.map((doc) => normalizeMessage(doc.id, doc.data() ?? {}));
}

export async function getCmsContactMessageById(id: string): Promise<CmsContactMessage | undefined> {
  const db = await getAdminFirestore();
  if (!db) return undefined;
  const doc = await db.collection(FIREBASE_COLLECTIONS.contactMessages).doc(id).get();
  if (doc.exists) return normalizeMessage(doc.id, doc.data() ?? {});
  return undefined;
}

export async function updateCmsContactMessage(
  id: string,
  update: { status?: "new" | "reviewed" | "archived"; notes?: string },
) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.contactMessages).doc(id).set(
    { ...update, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  return { configured: true, written: true } as const;
}

export async function deleteCmsContactMessage(id: string) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  await db.collection(FIREBASE_COLLECTIONS.contactMessages).doc(id).delete();
  return { configured: true, written: true } as const;
}

function normalizeMessage(id: string, data: Record<string, unknown>): CmsContactMessage {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    email: typeof data.email === "string" ? data.email : "",
    phone: typeof data.phone === "string" ? data.phone : undefined,
    organisation: typeof data.organisation === "string" ? data.organisation : undefined,
    enquiryType: typeof data.enquiryType === "string" ? data.enquiryType : "general",
    preferredContact: typeof data.preferredContact === "string" ? data.preferredContact : undefined,
    message: typeof data.message === "string" ? data.message : "",
    status: data.status === "reviewed" || data.status === "archived" ? (data.status as CmsContactMessage["status"]) : "new",
    createdAt: toIsoDate(data.createdAt),
  };
}

function toIsoDate(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value && "toDate" in value) {
    try { return (value as { toDate: () => Date }).toDate().toISOString(); } catch { return undefined; }
  }
  return undefined;
}
