import { getAdminFirestore } from "@/lib/firebase/admin";

export type AuditEntry = {
  id?: string;
  action: "create" | "update" | "delete" | "login" | "logout";
  resourceType: string; // e.g., users, articles, team, partners, testimonials, applications, messages
  resourceId: string;
  actor?: {
    uid?: string;
    email?: string;
    role?: string;
  } | null;
  summary?: string;
  changes?: Record<string, unknown>;
  createdAt?: string; // ISO when read
};

export async function writeAuditLog(entry: Omit<AuditEntry, "id" | "createdAt">) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection("auditLog").add({
    action: entry.action,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId,
    actor: entry.actor ?? null,
    summary: entry.summary ?? null,
    changes: entry.changes ?? null,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { configured: true, written: true } as const;
}

export async function getAuditLogs(limit = 100): Promise<AuditEntry[]> {
  const db = await getAdminFirestore();
  if (!db) return [];
  const snapshot = await db
    .collection("auditLog")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snapshot.docs.map((doc) => normalizeAudit(doc.id, doc.data() ?? {}));
}

function normalizeAudit(id: string, data: Record<string, unknown>): AuditEntry {
  return {
    id,
    action:
      data.action === "create" ||
      data.action === "update" ||
      data.action === "delete" ||
      data.action === "login" ||
      data.action === "logout"
        ? (data.action as AuditEntry["action"]) : "update",
    resourceType: typeof data.resourceType === "string" ? data.resourceType : "unknown",
    resourceId: typeof data.resourceId === "string" ? data.resourceId : "",
    actor: data.actor && typeof data.actor === "object" ? (data.actor as AuditEntry["actor"]) : null,
    summary: typeof data.summary === "string" ? data.summary : undefined,
    changes: data.changes && typeof data.changes === "object" ? (data.changes as Record<string, unknown>) : undefined,
    createdAt: toIso(data.createdAt),
  };
}

function toIso(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value && "toDate" in value) {
    try { return (value as { toDate: () => Date }).toDate().toISOString(); } catch { return undefined; }
  }
  return undefined;
}
