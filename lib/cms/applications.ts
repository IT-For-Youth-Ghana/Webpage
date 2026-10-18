import { getAdminFirestore } from "@/lib/firebase/admin";
import { adminApplicationRecords } from "@/lib/cms/admin-config";
import type { ApplicationAdminUpdatePayload } from "@/lib/utils/validators";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";
import type { AdminApplicationRecord } from "@/types/admin";

export async function getCmsApplications(): Promise<AdminApplicationRecord[]> {
  const db = await getAdminFirestore();
  if (!db) {
    return adminApplicationRecords;
  }

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.applications).get();
    return snapshot.docs.map((doc) => normalizeApplication(doc.id, doc.data() ?? {}));
  } catch (error) {
    console.error("Firestore application read failed. Falling back to seed.", error);
    return adminApplicationRecords;
  }
}

export async function getCmsApplicationById(id: string): Promise<AdminApplicationRecord | undefined> {
  const db = await getAdminFirestore();
  if (!db) {
    return adminApplicationRecords.find((a) => a.id === id);
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.applications).doc(id).get();
    if (doc.exists) {
      return normalizeApplication(doc.id, doc.data() ?? {});
    }
    return undefined;
  } catch (error) {
    console.error("Firestore application lookup failed. Falling back to seed.", error);
    return adminApplicationRecords.find((a) => a.id === id);
  }
}

export async function updateCmsApplication(
  id: string,
  payload: ApplicationAdminUpdatePayload,
) {
  const db = await getAdminFirestore();
  if (!db) {
    return { configured: false, written: false } as const;
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.applications).doc(id).set(
    {
      status: payload.status,
      notes: payload.notes ?? "",
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { configured: true, written: true } as const;
}

export async function deleteCmsApplication(id: string) {
  const db = await getAdminFirestore();
  if (!db) {
    return { configured: false, written: false } as const;
  }
  await db.collection(FIREBASE_COLLECTIONS.applications).doc(id).delete();
  return { configured: true, written: true } as const;
}

function normalizeApplication(
  id: string,
  data: Record<string, unknown>,
): AdminApplicationRecord {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    email: typeof data.email === "string" ? data.email : "",
    course: typeof data.course === "string" ? data.course : "",
    status:
      data.status === "reviewed" ||
      data.status === "shortlisted" ||
      data.status === "rejected" ||
      data.status === "enrolled"
        ? (data.status as AdminApplicationRecord["status"])
        : "new",
    submittedAt: toDateString(data.createdAt) ?? new Date().toISOString(),
    notes: typeof data.notes === "string" ? data.notes : "",
  };
}

function toDateString(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "object" && value && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
    } catch {
      return undefined;
    }
  }
  return undefined;
}
