import { getAdminFirestore } from "@/lib/firebase/admin";
import type { JobPayload } from "@/lib/utils/validators";
import type { JobListing } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

const seedJobs: JobListing[] = [];

function toDateString(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  }

  return undefined;
}

function normalizeJob(id: string, data: Record<string, unknown>): JobListing | null {
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const summary = typeof data.summary === "string" ? data.summary.trim() : "";

  if (!title || !summary) {
    return null;
  }

  const status =
    data.status === "draft" || data.status === "closed" || data.status === "published"
      ? data.status
      : "draft";

  return {
    id,
    title,
    summary,
    team: typeof data.team === "string" ? data.team : "General",
    location: typeof data.location === "string" ? data.location : "Accra, Ghana",
    type: data.type === "part-time" || data.type === "contract" || data.type === "volunteer" ? data.type : "full-time",
    status,
    applyUrl: typeof data.applyUrl === "string" ? data.applyUrl : undefined,
    closingDate: toDateString(data.closingDate),
    featured: data.featured === true,
  };
}

function sortJobs(jobs: JobListing[]) {
  return [...jobs].sort((left, right) => {
    const leftDate = left.closingDate ? new Date(left.closingDate).getTime() : Number.MAX_SAFE_INTEGER;
    const rightDate = right.closingDate ? new Date(right.closingDate).getTime() : Number.MAX_SAFE_INTEGER;
    return leftDate - rightDate;
  });
}

export async function getCmsJobs(includeDrafts = false): Promise<JobListing[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return includeDrafts ? sortJobs(seedJobs) : sortJobs(seedJobs.filter((job) => job.status === "published"));
  }

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.jobListings).get();

    if (snapshot.empty) {
      return includeDrafts ? sortJobs(seedJobs) : sortJobs(seedJobs.filter((job) => job.status === "published"));
    }

    const jobs = snapshot.docs
      .map((doc) => normalizeJob(doc.id, doc.data()))
      .filter((job): job is JobListing => job !== null);

    const scoped = includeDrafts ? jobs : jobs.filter((job) => job.status === "published");
    return sortJobs(scoped);
  } catch (error) {
    console.error("Firestore jobs read failed.", error);
    return includeDrafts ? sortJobs(seedJobs) : sortJobs(seedJobs.filter((job) => job.status === "published"));
  }
}

export async function getCmsJobById(id: string): Promise<JobListing | undefined> {
  const db = await getAdminFirestore();

  if (!db) {
    return seedJobs.find((job) => job.id === id);
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.jobListings).doc(id).get();

    if (!doc.exists) {
      return undefined;
    }

    return normalizeJob(doc.id, doc.data() ?? {}) ?? undefined;
  } catch (error) {
    console.error("Firestore job lookup failed.", error);
    return seedJobs.find((job) => job.id === id);
  }
}

export async function saveCmsJob(payload: JobPayload, id?: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const docRef = id
    ? db.collection(FIREBASE_COLLECTIONS.jobListings).doc(id)
    : db.collection(FIREBASE_COLLECTIONS.jobListings).doc();
  const { FieldValue } = await import("firebase-admin/firestore");
  const timestamps = id
    ? { updatedAt: FieldValue.serverTimestamp() }
    : {
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

  await docRef.set(
    {
      title: payload.title,
      summary: payload.summary,
      team: payload.team,
      location: payload.location,
      type: payload.type,
      status: payload.status,
      applyUrl: payload.applyUrl,
      closingDate: payload.closingDate,
      featured: payload.featured ?? false,
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

export async function deleteCmsJob(id: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  await db.collection(FIREBASE_COLLECTIONS.jobListings).doc(id).delete();

  return {
    configured: true,
    written: true,
    id,
  };
}
