import { getAdminFirestore } from "@/lib/firebase/admin";
import type { TeamPayload } from "@/lib/utils/validators";
import type { TeamMemberProfile } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

function toNumber(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeTeamMember(id: string, data: Record<string, unknown>): TeamMemberProfile {
  const status = data.status === "inactive" ? "inactive" : "active";

  return {
    id,
    name: typeof data.name === "string" ? data.name : "Unnamed Member",
    role: typeof data.role === "string" ? data.role : "",
    department: typeof data.department === "string" ? data.department : "General",
    departmentId: typeof data.departmentId === "string" ? data.departmentId : undefined,
    departmentSlug: typeof data.departmentSlug === "string" ? data.departmentSlug : undefined,
    bio: typeof data.bio === "string" ? data.bio : "",
    photo: typeof data.photo === "string" ? data.photo : undefined,
    email: typeof data.email === "string" ? data.email : undefined,
    linkedin: typeof data.linkedin === "string" ? data.linkedin : undefined,
    featured: data.featured === true,
    status,
    order: toNumber(data.order, 0),
  };
}

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

export async function getCmsTeamMembers(includeInactive = false): Promise<TeamMemberProfile[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return [];
  }

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.team).get();
    let members = snapshot.docs.map((doc) => normalizeTeamMember(doc.id, doc.data() ?? {}));

    if (!includeInactive) {
      members = members.filter((m) => m.status === "active");
    }

    return members.sort((a, b) => {
      const dept = a.department.localeCompare(b.department);
      if (dept !== 0) return dept;
      return a.order - b.order;
    });
  } catch (error) {
    console.error("Firestore team read failed.", error);
    return [];
  }
}

export async function getCmsTeamMemberById(id: string): Promise<TeamMemberProfile | undefined> {
  const db = await getAdminFirestore();

  if (!db) {
    return undefined;
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.team).doc(id).get();
    if (!doc.exists) return undefined;
    return normalizeTeamMember(doc.id, doc.data() ?? {});
  } catch (error) {
    console.error("Firestore team lookup failed.", error);
    return undefined;
  }
}

export async function saveCmsTeamMember(
  payload: TeamPayload,
  id?: string,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false };
  }

  const docRef = id
    ? db.collection(FIREBASE_COLLECTIONS.team).doc(id)
    : db.collection(FIREBASE_COLLECTIONS.team).doc();

  const { FieldValue } = await import("firebase-admin/firestore");
  const timestamps = id
    ? { updatedAt: FieldValue.serverTimestamp() }
    : { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() };

  const record = {
    name: payload.name,
    role: payload.role,
    department: payload.department,
    departmentId: payload.departmentId,
    departmentSlug: payload.departmentSlug,
    bio: payload.bio,
    photo: payload.photo,
    email: payload.email,
    linkedin: payload.linkedin,
    featured: payload.featured ?? false,
    status: payload.status ?? "active",
    order: typeof payload.order === "number" ? payload.order : 0,
  } as Record<string, unknown>;

  await docRef.set({ ...(stripUndefined(record) as Record<string, unknown>), ...timestamps }, { merge: true });

  return { configured: true, written: true, id: docRef.id };
}

export async function deleteCmsTeamMember(id: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false };
  }

  await db.collection(FIREBASE_COLLECTIONS.team).doc(id).delete();
  return { configured: true, written: true, id };
}
