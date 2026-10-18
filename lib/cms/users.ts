import { randomBytes } from "crypto";

import {
  isAdminUserWelcomeEmailConfigured,
  sendAdminUserWelcomeEmail,
} from "@/lib/email/admin-user-welcome";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";
import type { UserPayload } from "@/lib/utils/validators";
import type { UserAccessRole } from "@/types/admin";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: UserAccessRole;
  status: "active" | "inactive";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

type CmsCreateResult = CmsWriteResult & {
  authCreated: boolean;
  emailConfigured: boolean;
  emailDelivered: boolean;
  emailError?: string;
};

function toIsoDate(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function normalizeUser(id: string, data: Record<string, unknown>): CmsUser {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    email: typeof data.email === "string" ? data.email : "",
    role:
      data.role === "super-admin" ||
      data.role === "editor" ||
      data.role === "viewer" ||
      data.role === "file-server-only"
        ? (data.role as CmsUser["role"]) 
        : "viewer",
    status: data.status === "inactive" ? "inactive" : "active",
    notes: typeof data.notes === "string" ? data.notes : undefined,
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
  };
}

export async function getCmsUsers(): Promise<CmsUser[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return [];
  }

  const snapshot = await db.collection(FIREBASE_COLLECTIONS.users).get();
  return snapshot.docs.map((doc) => normalizeUser(doc.id, doc.data() ?? {}));
}

export async function getCmsUserById(id: string): Promise<CmsUser | undefined> {
  const db = await getAdminFirestore();

  if (!db) {
    return undefined;
  }

  const doc = await db.collection(FIREBASE_COLLECTIONS.users).doc(id).get();
  if (doc.exists) {
    return normalizeUser(doc.id, doc.data() ?? {});
  }

  const emailMatch = await db
    .collection(FIREBASE_COLLECTIONS.users)
    .where("email", "==", id.toLowerCase())
    .limit(1)
    .get();

  if (emailMatch.empty) return undefined;
  const matchedDoc = emailMatch.docs[0];
  return normalizeUser(matchedDoc.id, matchedDoc.data());
}

export async function saveCmsUser(payload: UserPayload, id?: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false };
  }

  const docRef = id
    ? db.collection(FIREBASE_COLLECTIONS.users).doc(id)
    : db.collection(FIREBASE_COLLECTIONS.users).doc();

  const { FieldValue } = await import("firebase-admin/firestore");
  const timestamps = id
    ? { updatedAt: FieldValue.serverTimestamp() }
    : { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() };

  await docRef.set(
    {
      name: payload.name,
      email: payload.email.toLowerCase(),
      role: payload.role,
      status: payload.status,
      notes: payload.notes ?? undefined,
      ...timestamps,
    },
    { merge: true },
  );

  return { configured: true, written: true, id: docRef.id };
}

function generateTemporaryPassword() {
  const randomPart = randomBytes(18).toString("base64url");
  return `ITFY-${randomPart}-9a!`;
}

export async function createCmsUserWithAuth(payload: UserPayload): Promise<CmsCreateResult> {
  const [auth, db] = await Promise.all([getAdminAuth(), getAdminFirestore()]);

  if (!auth || !db) {
    return {
      configured: false,
      written: false,
      authCreated: false,
      emailConfigured: false,
      emailDelivered: false,
    };
  }

  if (!isAdminUserWelcomeEmailConfigured()) {
    return {
      configured: true,
      written: false,
      authCreated: false,
      emailConfigured: false,
      emailDelivered: false,
    };
  }

  const email = payload.email.toLowerCase();
  const temporaryPassword = generateTemporaryPassword();

  const authUser = await auth.createUser({
    email,
    password: temporaryPassword,
    displayName: payload.name,
    disabled: payload.status === "inactive",
    emailVerified: false,
  });

  const result = await saveCmsUser({ ...payload, email }, authUser.uid);

  if (!result.configured || !result.written) {
    await auth.deleteUser(authUser.uid).catch((error) => {
      console.error("Failed to roll back Firebase Auth user after CMS write failure", error);
    });

    return {
      configured: result.configured,
      written: result.written,
      id: result.id,
      authCreated: true,
      emailConfigured: true,
      emailDelivered: false,
    };
  }

  const emailResult = await sendAdminUserWelcomeEmail({
    user: { ...payload, email },
    temporaryPassword,
  });

  if (!emailResult.delivered) {
    await Promise.allSettled([
      db.collection(FIREBASE_COLLECTIONS.users).doc(authUser.uid).delete(),
      auth.deleteUser(authUser.uid),
    ]);

    return {
      configured: true,
      written: false,
      id: authUser.uid,
      authCreated: false,
      emailConfigured: emailResult.configured,
      emailDelivered: false,
      emailError: emailResult.error,
    };
  }

  return {
    configured: true,
    written: true,
    id: authUser.uid,
    authCreated: true,
    emailConfigured: emailResult.configured,
    emailDelivered: emailResult.delivered,
    emailError: emailResult.error,
  };
}

export async function deleteCmsUser(id: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false };
  }

  await db.collection(FIREBASE_COLLECTIONS.users).doc(id).delete();
  return { configured: true, written: true, id };
}
