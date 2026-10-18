export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { TrainingCourseListingPage } from "@/components/training/training-course-listing-page";
import { getTrainingCatalogMixed } from "@/lib/api/training";
import { getCmsTrainingCoursesPage } from "@/lib/cms/site-pages";
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsTrainingCoursesPage();

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: "/apply-for-training/courses",
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function TrainingCoursesPage() {
  const page = await getCmsTrainingCoursesPage();
  const courses = await getTrainingCatalogMixed(page.courses);

  return <TrainingCourseListingPage page={page} courses={courses} />;
}
