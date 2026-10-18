export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramsOverview } from "@/components/programs/programs-overview";
import { getCourseCatalog } from "@/lib/api/courses";
import { pageMetadata } from "@/lib/seo/page-metadata";

type ProgramCategoryPageProps = {
  params: { category: string };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * The category label comes from the catalogue rather than from the URL, so an
 * unknown category produces a noindex page rather than a plausible title
 * title-cased out of whatever someone typed.
 */
export async function generateMetadata({ params }: ProgramCategoryPageProps): Promise<Metadata> {
  const courses = await getCourseCatalog();
  const match = courses.find((course) => slugify(course.category) === params.category);

  if (!match) {
    return pageMetadata({
      title: "Category not found",
      description: "This programme category does not exist.",
      path: `/programs/${params.category}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: match.category,
    description: `Courses in ${match.category} from the IT For Youth Ghana training portal.`,
    path: `/programs/${params.category}`,
  });
}

export default async function ProgramCategoryPage({ params }: ProgramCategoryPageProps) {
  const courses = await getCourseCatalog();
  const filtered = courses.filter((course) => slugify(course.category) === params.category);

  /**
   * An unknown category is a 404, not the whole catalogue.
   *
   * Falling back to every course meant /programs/anything answered 200 with the
   * same page as /programs, so the catalogue was indexable at as many URLs as
   * anyone cared to invent.
   */
  if (filtered.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ProgramsOverview courses={filtered} />
    </div>
  );
}
