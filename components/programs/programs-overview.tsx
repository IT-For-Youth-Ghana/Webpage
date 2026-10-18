import Link from "next/link";

import type { Course } from "@/types/course";
import { FeatureCard } from "@/components/content/feature-card";

type ProgramsOverviewProps = {
  courses: Course[];
};

export function ProgramsOverview({ courses }: ProgramsOverviewProps) {
  const featuredCourses = courses.slice(0, 6);

  return (
    <div className="space-y-10">
      {/* This header previously read "Programs Portal Compatibility" and
          explained that /programs/** remained available "in the rebuild branch
          while the rest of the public site moves into the new information
          architecture". That is developer-facing text on a public page: a
          visitor does not know what a rebuild branch is. Replaced with copy
          that describes what the page is for. */}
      <div className="rounded-panel border border-brand-border bg-white p-8 shadow-sm">
        <h1 className="font-heading text-4xl font-semibold text-brand-ink">Browse courses</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Every course IT For Youth Ghana currently runs, in one list. Open any course to see its
          length, level, start date and what you will build, then apply from the same page.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredCourses.length ? (
          featuredCourses.map((course) => (
            <FeatureCard
              key={course.id}
              image={course.image}
              imageAlt={course.title}
              category={course.category}
              title={course.title}
              description={course.shortDescription}
              href={`/apply-for-training/courses/${course.slug}`}
              ctaLabel="View details"
            />
          ))
        ) : (
          /* The empty state also spoke to developers about integration layers
             and successful compilation. A visitor needs to know what to do. */
          <div className="rounded-panel border border-dashed border-brand-border bg-white p-8 text-sm text-slate-600 md:col-span-2 xl:col-span-3">
            The course list is not available right now. Try again shortly, or{" "}
            <Link href="/contact" className="font-bold text-brand-primary underline decoration-2 underline-offset-4">
              contact the team
            </Link>{" "}
            and we will tell you what is opening next.
          </div>
        )}
      </div>
    </div>
  );
}
