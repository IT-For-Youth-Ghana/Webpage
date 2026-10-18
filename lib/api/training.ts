import { getCourseCatalog, getCourseBySlug as getCourseBySlugApi } from "@/lib/api/courses";
import { seedTrainingCourses } from "@/lib/content/training-config";
import type { Course } from "@/types/course";
import { transformCourseData } from "@/types/course";

function sortCourses(courses: Course[]) {
  return [...courses].sort((left, right) => {
    if (!left.startDate && !right.startDate) {
      return left.title.localeCompare(right.title);
    }
    if (!left.startDate) {
      return 1;
    }
    if (!right.startDate) {
      return -1;
    }

    return new Date(left.startDate).getTime() - new Date(right.startDate).getTime();
  });
}

export async function getTrainingCatalog(): Promise<Course[]> {
  const liveCourses = await getCourseCatalog();
  if (liveCourses.length) {
    return sortCourses(liveCourses);
  }

  return sortCourses(seedTrainingCourses);
}

export async function getTrainingCatalogMixed(cmsCourses?: unknown[]): Promise<Course[]> {
  const external = await getCourseCatalog();
  const base = external.length ? external : seedTrainingCourses;

  const cms: Course[] = Array.isArray(cmsCourses)
    ? cmsCourses
        .map((raw) => {
          try {
            return transformCourseData(raw);
          } catch {
            return null;
          }
        })
        .filter((c): c is Course => Boolean(c))
    : [];

  // Prefer CMS overrides when slug collides
  const bySlug = new Map<string, Course>();
  for (const c of base) bySlug.set(c.slug || c.id, c);
  for (const c of cms) bySlug.set(c.slug || c.id, c);

  return sortCourses(Array.from(bySlug.values()));
}

export async function getCourseBySlugMixed(slug: string, cmsCourses?: unknown[]): Promise<Course | null> {
  const apiCourse = await getCourseBySlugApi(slug);
  if (apiCourse) return apiCourse;

  if (Array.isArray(cmsCourses)) {
    for (const raw of cmsCourses) {
      try {
        const course = transformCourseData(raw);
        if (course.slug === slug || course.id === slug) {
          return course;
        }
      } catch {
        // ignore invalid CMS entries
      }
    }
  }

  // Final fallback: search in seed set
  const seed = seedTrainingCourses.find((c) => c.slug === slug || c.id === slug) || null;
  return seed;
}
