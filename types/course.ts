export interface CourseCategory {
  id: string;
  name: string;
  description: string | null;
  course_count: number;
}

export interface CoursePricing {
  amount: number | null;
  currency: string;
  isFree: boolean;
}

export interface CourseInstructor {
  name: string;
  email?: string | null;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionHtml?: string | null;
  shortDescription: string;
  category: string;
  level: string;
  duration: string;
  deliveryMode: string;
  image: string | null;
  pricing: CoursePricing;
  tags: string[];
  applyUrl: string | null;
  startDate: string | null;
  endDate?: string | null;
  objectives?: string[];
  requirements?: string[];
  includedItems?: string[];
  previewVideoUrl?: string | null;
  language?: string | null;
  enrollmentCount?: number | null;
  provider?: string | null;
  teachers?: CourseInstructor[];
}

export interface RawApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

const htmlToText = (value: string) =>
  value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();

const sanitizeCourseHtml = (value: string) => {
  // Keep HTML structure and inline styles but strip scripts, stylesheets, dangerous tags,
  // inline event handlers, srcdoc, and javascript: URLs.
  const cleaned = value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?(iframe|object|embed|form|input|button|textarea|select|link|meta)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\ssrcdoc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, ' $1="#"');

  return cleaned.trim() ? cleaned : null;
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const pickString = (record: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const pickNumber = (record: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const numericValue = Number(value.replace(/,/g, ""));
      if (Number.isFinite(numericValue)) {
        return numericValue;
      }
    }
  }
  return null;
};

const pickBoolean = (record: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();
      if (["true", "yes", "1"].includes(normalizedValue)) {
        return true;
      }
      if (["false", "no", "0"].includes(normalizedValue)) {
        return false;
      }
    }
  }
  return null;
};

const pickArray = (record: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }
  }
  return [];
};

const formatDuration = (record: Record<string, unknown>) => {
  const explicitDuration = pickString(record, "duration", "length");
  if (explicitDuration) {
    return explicitDuration;
  }

  const durationWeeks = pickNumber(record, "durationWeeks", "weeks");
  if (durationWeeks !== null) {
    return `${durationWeeks} week${durationWeeks === 1 ? "" : "s"}`;
  }

  return "Flexible";
};

export function transformCourseData(raw: unknown): Course {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid course payload");
  }

  const record = raw as Record<string, unknown>;
  const title = pickString(record, "title", "name");
  const description = pickString(record, "description", "summary", "excerpt");
  const normalizedDescription = description ? htmlToText(description) : "Course details coming soon.";
  const shortDescription =
    htmlToText(pickString(record, "shortDescription", "short_description", "excerpt")) ||
    normalizedDescription.slice(0, 160);
  const amountValue = pickNumber(record, "price", "amount", "fee");
  const explicitFreeValue = pickBoolean(record, "isFree", "isFreeFlag", "free");
  const isFree =
    explicitFreeValue === true ||
    amountValue === 0 ||
    pickString(record, "pricingType", "payment_type").toLowerCase() === "free";

  const id = pickString(record, "id", "_id", "uuid") || toSlug(title);
  const slug = pickString(record, "slug") || toSlug(title || id);

  return {
    id,
    slug,
    title: title || "Untitled course",
    description: normalizedDescription,
    descriptionHtml: description ? sanitizeCourseHtml(description) : null,
    shortDescription,
    category: pickString(record, "category", "categoryName", "track") || "General",
    level: pickString(record, "level", "difficulty") || "All levels",
    duration: formatDuration(record),
    deliveryMode: pickString(record, "deliveryMode", "mode", "format") || "Hybrid",
    image:
      pickString(record, "thumbnailUrl", "moodleImageUrl", "image", "thumbnail", "coverImage") ||
      null,
    pricing: {
      amount: isFree ? 0 : amountValue,
      currency: pickString(record, "currency") || "GHS",
      isFree,
    },
    tags: pickArray(record, "tags", "skills"),
    applyUrl:
      pickString(record, "applyUrl", "applicationUrl") ||
      `https://portal.itforyouthghana.org?course=${encodeURIComponent(slug)}`,
    startDate: pickString(record, "startDate", "startsAt") || null,
    endDate: pickString(record, "endDate", "endsAt") || null,
    objectives: pickArray(record, "objectives", "learningObjectives", "outcomes"),
    requirements: pickArray(record, "requirements", "prerequisites"),
    includedItems: pickArray(record, "includedItems", "includes"),
    previewVideoUrl: pickString(record, "previewVideoUrl", "videoUrl") || null,
    language: pickString(record, "language", "lang") || null,
    enrollmentCount: pickNumber(record, "enrollmentCount", "enrolled"),
    provider: pickString(record, "deliveryProvider", "provider", "progressSource") || null,
    teachers: Array.isArray((record as any).teachers)
      ? ((record as any).teachers as any[])
          .map((t) => {
            if (t && typeof t === "object") {
              const tr = t as Record<string, unknown>;
              const first = pickString(tr, "firstName", "first_name");
              const last = pickString(tr, "lastName", "last_name");
              const name = `${first} ${last}`.trim() || pickString(tr, "name");
              const email = pickString(tr, "email") || null;
              if (name) {
                return { name, email } as CourseInstructor;
              }
            }
            return null;
          })
          .filter((x): x is CourseInstructor => Boolean(x))
      : Array.isArray((record as any).instructors)
      ? ((record as any).instructors as any[])
          .map((name) => {
            if (typeof name === "string" && name.trim()) {
              return { name: name.trim() } as CourseInstructor;
            }
            return null;
          })
          .filter((x): x is CourseInstructor => Boolean(x))
      : [],
  };
}
