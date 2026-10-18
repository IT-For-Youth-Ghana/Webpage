import { departments as seedDepartments } from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { DepartmentPayload } from "@/lib/utils/validators";
import type {
  ActionLink,
  ContentBlock,
  DepartmentContact,
  DepartmentProcessStep,
  DepartmentProfile,
  DepartmentResource,
  DepartmentStatus,
  HighlightStat,
} from "@/types/content";
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

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];
}

function toActionLinks(value: unknown): ActionLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      const label = typeof record.label === "string" ? record.label.trim() : "";
      const href = typeof record.href === "string" ? record.href.trim() : "";
      return label && href ? { label, href } : null;
    })
    .filter((item): item is ActionLink => item !== null);
}

function toStats(value: unknown): HighlightStat[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<HighlightStat[]>((items, item) => {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const statValue = typeof record.value === "string" ? record.value.trim() : "";
    const label = typeof record.label === "string" ? record.label.trim() : "";
    if (!statValue || !label) return items;

    items.push({
      value: statValue,
      label,
      ...(typeof record.description === "string" ? { description: record.description } : {}),
      ...(typeof record.icon === "string" ? { icon: record.icon } : {}),
      ...(typeof record.iconImage === "string" ? { iconImage: record.iconImage } : {}),
    });
    return items;
  }, []);
}

function toContentBlocks(value: unknown): ContentBlock[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<ContentBlock[]>((items, item) => {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const title = typeof record.title === "string" ? record.title.trim() : "";
    const body = typeof record.body === "string" ? record.body.trim() : "";
    if (!title || !body) return items;
    items.push({ title, body, bullets: toStringArray(record.bullets) });
    return items;
  }, []);
}

function toWorkflowSteps(value: unknown): DepartmentProcessStep[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<DepartmentProcessStep[]>((items, item) => {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const title = typeof record.title === "string" ? record.title.trim() : "";
    const description = typeof record.description === "string" ? record.description.trim() : "";
    if (title && description) items.push({ title, description });
    return items;
  }, []);
}

function toResources(value: unknown): DepartmentResource[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<DepartmentResource[]>((items, item) => {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const href = typeof record.href === "string" ? record.href.trim() : "";
    if (!label || !href) return items;
    items.push({
      label,
      href,
      ...(typeof record.description === "string" ? { description: record.description } : {}),
    });
    return items;
  }, []);
}

function toContact(value: unknown): DepartmentContact | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const contact = {
    name: typeof record.name === "string" ? record.name : undefined,
    role: typeof record.role === "string" ? record.role : undefined,
    email: typeof record.email === "string" ? record.email : undefined,
  };
  return contact.name || contact.role || contact.email ? contact : undefined;
}

function normalizeStatus(value: unknown): DepartmentStatus {
  if (value === "draft" || value === "archived") return value;
  return "published";
}

function normalizeDepartment(id: string, data: Record<string, unknown>): DepartmentProfile | null {
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const slug = typeof data.slug === "string" ? data.slug.trim() : "";

  if (!title || !slug) return null;

  return {
    id,
    slug,
    eyebrow: typeof data.eyebrow === "string" ? data.eyebrow : "Department",
    title,
    summary: typeof data.summary === "string" ? data.summary : "",
    description: typeof data.description === "string" ? data.description : "",
    intro: typeof data.intro === "string" ? data.intro : "",
    mission: typeof data.mission === "string" ? data.mission : "",
    heroImage: typeof data.heroImage === "string" ? data.heroImage : undefined,
    icon: typeof data.icon === "string" ? data.icon : undefined,
    iconImage: typeof data.iconImage === "string" ? data.iconImage : undefined,
    color: typeof data.color === "string" ? data.color : undefined,
    responsibilities: toStringArray(data.responsibilities),
    services: toContentBlocks(data.services),
    workflows: toWorkflowSteps(data.workflows),
    priorities: toStringArray(data.priorities),
    stats: toStats(data.stats),
    teamMemberIds: toStringArray(data.teamMemberIds),
    resources: toResources(data.resources),
    contact: toContact(data.contact),
    ctas: toActionLinks(data.ctas),
    featured: data.featured === true,
    status: normalizeStatus(data.status),
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

function sortDepartments(departments: DepartmentProfile[]) {
  return [...departments].sort((left, right) => {
    const order = left.order - right.order;
    if (order !== 0) return order;
    return left.title.localeCompare(right.title);
  });
}

export async function getCmsDepartments(includeUnpublished = false): Promise<DepartmentProfile[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return sortDepartments(
      includeUnpublished
        ? seedDepartments
        : seedDepartments.filter((department) => department.status === "published"),
    );
  }

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.departments).get();

    if (snapshot.empty) {
      return sortDepartments(
        includeUnpublished
          ? seedDepartments
          : seedDepartments.filter((department) => department.status === "published"),
      );
    }

    let departments = snapshot.docs
      .map((doc) => normalizeDepartment(doc.id, doc.data() ?? {}))
      .filter((department): department is DepartmentProfile => department !== null);

    if (!includeUnpublished) {
      departments = departments.filter((department) => department.status === "published");
    }

    return departments.length ? sortDepartments(departments) : sortDepartments(seedDepartments);
  } catch (error) {
    console.error("Firestore department read failed. Falling back to seeds.", error);
    return sortDepartments(seedDepartments);
  }
}

export async function getCmsDepartmentBySlug(slug: string, includeUnpublished = false) {
  const departments = await getCmsDepartments(includeUnpublished);
  return departments.find((department) => department.slug === slug);
}

export async function getCmsDepartmentById(id: string): Promise<DepartmentProfile | undefined> {
  const db = await getAdminFirestore();

  if (!db) {
    return seedDepartments.find((department) => department.id === id || department.slug === id);
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.departments).doc(id).get();

    if (!doc.exists) {
      return undefined;
    }

    return normalizeDepartment(doc.id, doc.data() ?? {}) ?? undefined;
  } catch (error) {
    console.error("Firestore department lookup failed.", error);
    return seedDepartments.find((department) => department.id === id || department.slug === id);
  }
}

export async function saveCmsDepartment(
  payload: DepartmentPayload,
  id?: string,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false };
  }

  const docRef = id
    ? db.collection(FIREBASE_COLLECTIONS.departments).doc(id)
    : db.collection(FIREBASE_COLLECTIONS.departments).doc(payload.slug);
  const { FieldValue } = await import("firebase-admin/firestore");
  const timestamps = id
    ? { updatedAt: FieldValue.serverTimestamp() }
    : { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() };

  const record = {
    ...payload,
    order: typeof payload.order === "number" ? payload.order : 0,
    featured: payload.featured ?? false,
    status: payload.status ?? "draft",
  };

  await docRef.set({ ...(stripUndefined(record) as Record<string, unknown>), ...timestamps }, { merge: true });

  return { configured: true, written: true, id: docRef.id };
}

export async function deleteCmsDepartment(id: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false };
  }

  await db.collection(FIREBASE_COLLECTIONS.departments).doc(id).delete();
  return { configured: true, written: true, id };
}
