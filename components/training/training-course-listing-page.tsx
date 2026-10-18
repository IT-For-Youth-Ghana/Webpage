import { breadcrumbs } from "@/lib/content/site-config";

import { CapsulePageHero } from "@/components/capsule";
import { SectionIntro } from "@/components/content/section-intro";
import { EditorialGuidanceGrid } from "@/components/shared/editorial-guidance-grid";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { TrainingCourseCatalog } from "@/components/training/training-course-catalog";
import { TrainingCohortTimeline } from "@/components/training/training-cohort-timeline";
import { TrainingProcessStrip } from "@/components/training/training-process-strip";
import { trainingCatalogContent } from "@/lib/content/training-config";
import type { SitePage } from "@/types/content";
import type { Course } from "@/types/course";

type TrainingCourseListingPageProps = {
  page: SitePage;
  courses: Course[];
};

export function TrainingCourseListingPage({
  page,
  courses,
}: TrainingCourseListingPageProps) {
  const [comparisonSection, shortlistSection] = page.sections;
  const catalogSections = [comparisonSection, shortlistSection].filter(
    (section): section is NonNullable<typeof section> => Boolean(section),
  );
  return (
    <div className="bg-white">
      <CapsulePageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={page.intro}
        imageSrc={page.heroImage ?? trainingCatalogContent.heroImage}
        imageAlt="Learners exploring training pathways"
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.apply.root, href: "/apply-for-training" },
          { label: breadcrumbs.apply.courses },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EditorialGuidanceGrid
          eyebrow={page.overviewTitle ?? "Catalog guidance"}
          sections={catalogSections}
        />
      </section>

      <TrainingCourseCatalog courses={courses} />

      {(page.cohorts ?? []).length ? <div id="cohorts" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <TrainingCohortTimeline
          eyebrow={page.operatingEyebrow ?? trainingCatalogContent.cohortsSectionEyebrow ?? "Upcoming cohorts"}
          title={
            page.operatingTitle ??
            trainingCatalogContent.cohortsSectionTitle ??
            "Cohort 8 Foundations is open. More programmes start in July and August."
          }
          description={
            page.operatingDescription ??
            trainingCatalogContent.cohortsSectionDescription ??
            "Review exact dates, formats, and deadlines so you can plan your application and participation with confidence."
          }
          cohorts={page.cohorts ?? []}
        />
      </div> : null}

      {(page.process ?? []).length ? <div id="process" className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <TrainingProcessStrip
            eyebrow={page.principlesEyebrow ?? trainingCatalogContent.processSectionEyebrow ?? "Apply process"}
            title={
              page.principlesTitle ??
              trainingCatalogContent.processSectionTitle ??
              "Four clear steps from interest to your first class"
            }
            description={
              page.principlesDescription ??
              trainingCatalogContent.processSectionDescription ??
              "We keep the process transparent. Know what to prepare, when decisions happen, and what support is available before you apply."
            }
            steps={page.process ?? []}
          />
        </div>
      </div> : null}

      {page.related.length ? (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <SectionIntro
            eyebrow={page.exploreEyebrow ?? "Next steps"}
            title={page.exploreTitle ?? "Not sure which course is right yet?"}
            description={page.exploreDescription ??
                  "Check eligibility guidance or review the full process before you apply. The team can also answer questions directly."}
          />
            <RouteCardGrid cards={page.related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
