import { Course, RawApiResponse, transformCourseData } from "@/types/course";

const DEFAULT_COURSE_API_ENDPOINT = "https://papi.itforyouthghana.org/api/courses";

const getCourseApiEndpoint = () =>
  (
    process.env.COURSE_API_ENDPOINT ||
    process.env.NEXT_PUBLIC_COURSE_API_ENDPOINT ||
    DEFAULT_COURSE_API_ENDPOINT
  ).replace(/\/+$/, "");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const extractCourses = (payload: RawApiResponse | unknown) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const data = payload.data;
  if (Array.isArray(data)) {
    return data;
  }

  if (isRecord(data)) {
    if (Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data.courses)) {
      return data.courses;
    }
  }

  if (Array.isArray(payload.courses)) {
    return payload.courses;
  }

  return [];
};

const extractCourse = (payload: unknown) => {
  if (!isRecord(payload)) {
    return null;
  }

  const data = payload.data;
  if (isRecord(data)) {
    if (isRecord(data.course)) {
      return data.course;
    }
    if (Array.isArray(data.data)) {
      return data.data[0] ?? null;
    }
    if (isRecord(data.data)) {
      return data.data;
    }
    return data;
  }

  if (isRecord(payload.course)) {
    return payload.course;
  }

  return payload;
};

export async function getCourseCatalog(): Promise<Course[]> {
  try {
    const response = await fetch(getCourseApiEndpoint(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as RawApiResponse;
    if (payload.success === false) {
      return [];
    }

    return extractCourses(payload)
      .map((course) => {
        try {
          return transformCourseData(course);
        } catch {
          return null;
        }
      })
      .filter((course): course is Course => course !== null);
  } catch {
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const response = await fetch(`${getCourseApiEndpoint()}/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const payload = (await response.json()) as RawApiResponse;
      if (payload.success !== false) {
        const course = extractCourse(payload);
        if (course) {
          return transformCourseData(course);
        }
      }
    }
  } catch {
    // Fall through to catalog lookup below.
  }

  const courses = await getCourseCatalog();
  return courses.find((course) => course.slug === slug || course.id === slug) ?? null;
}
