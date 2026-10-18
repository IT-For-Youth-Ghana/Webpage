import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { CapsulePageHero } from "@/components/capsule";
import { CircularFigure } from "@/components/media/circular-figure";
import { SectionIntro } from "@/components/content/section-intro";
import { TrainingProcessStrip } from "@/components/training/training-process-strip";
import type { SitePage, TrainingProcessStep } from "@/types/content";

type TrainingHowItWorksPageProps = {
  page: SitePage;
};

/* The four steps previously carried a hardcoded emoji each. Weight is carried
   by the numeral and the accent node now, so no icon field is set. */
function toProcessSteps(sections: SitePage["sections"]): TrainingProcessStep[] {
  return sections.slice(0, 4).map((section, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title: section.title,
    description: section.body,
  }));
}

export function TrainingHowItWorksPage({ page }: TrainingHowItWorksPageProps) {
  const processSteps = toProcessSteps(page.sections);
  const timelineSections = page.sections.slice(4, 8);
  const checklist = page.sections.flatMap((section) => section.bullets ?? []).slice(0, 6);

  return (
    <div className="bg-white">
      <CapsulePageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={
          [page.intro, page.principlesHeroTitle]
            .filter((value): value is string => Boolean(value?.trim()))
            .join(" ") || null
        }
        imageSrc={page.heroImage ?? "/images/randomPictures/studentslisteningfrontal.JPG"}
        imageAlt="Learners listening during orientation and onboarding"
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.apply.root, href: "/apply-for-training" },
          { label: breadcrumbs.apply.howItWorks },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <TrainingProcessStrip
          eyebrow="Apply process"
          title={page.overviewTitle ?? "Four steps, one clearer journey"}
          description={
            page.overviewDescription ??
            "The process below mirrors the same logic used on the course listing page, but gives learners a fuller explanation of what each stage is meant to do."
          }
          steps={processSteps}
        />
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionIntro
            eyebrow={page.operatingEyebrow ?? "Timeline"}
            title={page.operatingTitle ??
                "What the process usually looks like in practice"}
            description={page.operatingDescription ??
                "Exact dates shift by cohort, but the overall sequence stays consistent enough that learners can plan with confidence."}
          />

          <div className="grid gap-5 lg:grid-cols-4">
            {timelineSections.map((item, index) => (
              <div
                key={item.title}
                className="rounded-panel border border-brand-border bg-white p-6 shadow-sm"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-panel bg-brand-deep p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              {page.principlesEyebrow ?? "Prepare well"}
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold">
              {page.principlesTitle ?? "Small preparation steps make the process smoother"}
            </h2>
            <p className="mt-4 text-base leading-8 text-white/78">
              {page.principlesDescription ??
                "Most friction in application flows comes from uncertainty. These simple preparation steps help learners submit with more confidence and fewer surprises."}
            </p>

            {/* Circular, not wide. The apply process above this is a numbered
                sequence and the page hero is a capsule, so a third wide plate
                here would be the third similar shape in a row. The circular
                crop also works from this landscape source without waste. */}
            <CircularFigure
              className="mt-8 items-start text-left"
              src={page.principlesImage || "/images/randomPictures/studentslistening.jpg"}
              alt={page.principlesImageAlt || "A learner listening during an orientation session"}
              size="md"
              accent="var(--color-accent)"
            />
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="rounded-panel border border-brand-border bg-white px-5 py-5 shadow-sm"
              >
                <p className="text-base leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionIntro
            eyebrow={page.exploreEyebrow ?? "Next steps"}
            title={page.exploreTitle ?? "Keep moving while the decision is still fresh"}
            description={page.exploreDescription ??
                "Once the process makes sense, the next useful move is either choosing a pathway or checking whether the fit is right before you apply."}
          />

          <RouteCardGrid cards={page.related} />
        </div>
      </section>
    </div>
  );
}
