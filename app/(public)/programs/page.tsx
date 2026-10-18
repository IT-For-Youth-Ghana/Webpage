export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { ProgramsOverview } from "@/components/programs/programs-overview";
import { getCourseCatalog } from "@/lib/api/courses";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Programmes portal",
  description:
    "The live course catalogue from the IT For Youth Ghana training portal, grouped by category.",
  path: "/programs",
});

export default async function ProgramsPage() {
  const courses = await getCourseCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ProgramsOverview courses={courses} />
    </div>
  );
}
