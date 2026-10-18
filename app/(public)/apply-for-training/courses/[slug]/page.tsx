export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseDetailCard } from "@/components/programs/course-detail-card";
import { getCmsTrainingCoursesPage } from "@/lib/cms/site-pages";
import { getCourseBySlugMixed } from "@/lib/api/training";
import { pageMetadata } from "@/lib/seo/page-metadata";

type TrainingCourseDetailPageProps = {
  params: { slug: string };
};

/**
 * Resolve once, against all three sources in order: the live portal API, the
 * CMS course list, then the seed set.
 *
 * The page previously called getCourseBySlugMixed twice, the first time with no
 * CMS list, which meant two round trips to papi.itforyouthghana.org for every
 * request and a first result that was always discarded when the CMS held the
 * course.
 */
async function resolveCourse(slug: string) {
  const page = await getCmsTrainingCoursesPage();
  return getCourseBySlugMixed(slug, page.courses);
}

export async function generateMetadata({
  params,
}: TrainingCourseDetailPageProps): Promise<Metadata> {
  const course = await resolveCourse(params.slug);

  const path = `/apply-for-training/courses/${params.slug}`;

  if (!course) {
    // The page below returns a real 404 for this slug, so the metadata must not
    // invent a title from it. It previously title-cased the URL segment, which
    // gave every mistyped slug a plausible-looking page.
    return pageMetadata({
      title: "Course not found",
      description: "This course is not in the catalogue.",
      path,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: course.title,
    description: course.shortDescription,
    path,
    image: course.image,
    imageAlt: `Course artwork for ${course.title}`,
  });
}

export default async function TrainingCourseDetailPage({ params }: TrainingCourseDetailPageProps) {
  const course = await resolveCourse(params.slug);

  /**
   * An unresolvable slug is a 404, not a page.
   *
   * This route used to answer HTTP 200 with a heading derived from the URL, so
   * /apply-for-training/courses/anything-at-all rendered as a real course page.
   * Search engines index soft 404s, and the course catalogue is the one part of
   * this site whose slugs come from an external API, so the supply of wrong
   * slugs is unbounded.
   */
  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <CourseDetailCard course={course} fallbackTitle={course.title} />
    </div>
  );
}
