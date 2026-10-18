import { getAdminFirestore } from "@/lib/firebase/admin";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

type PersistenceResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

async function addDocument(
  collectionName: string,
  data: Record<string, unknown>,
): Promise<PersistenceResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  const docRef = await db.collection(collectionName).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    source: "website",
  });

  return {
    configured: true,
    written: true,
    id: docRef.id,
  };
}

export async function persistContactMessage(data: Record<string, unknown>) {
  return addDocument(FIREBASE_COLLECTIONS.contactMessages, {
    ...data,
    status: "new",
  });
}

export async function persistApplication(data: Record<string, unknown>) {
  return addDocument(FIREBASE_COLLECTIONS.applications, {
    ...data,
    status: "new",
    notes: "",
  });
}

export async function persistNewsletterSubscription(data: Record<string, unknown>) {
  return addDocument(FIREBASE_COLLECTIONS.newsletterSubs, {
    ...data,
    status: "active",
  });
}
