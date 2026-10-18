import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { CapsulePageHero } from "@/components/capsule";
import { MediaBand } from "@/components/media/media-band";
import { SectionIntro } from "@/components/content/section-intro";
import type { SitePage } from "@/types/content";

type TrainingWhoCanApplyPageProps = {
  page: SitePage;
};

export function TrainingWhoCanApplyPage({ page }: TrainingWhoCanApplyPageProps) {
  const audienceSections = page.sections.slice(0, 3);
  const readinessSection = page.sections[3] ?? page.sections[0];
  const practiceSection = readinessSection;
  /* Previously joined with " • ", which is a bullet list in disguise. These are
     whole sentences, so they read as prose. */
  const supportingText =
    [page.intro, practiceSection?.body, ...(practiceSection?.bullets ?? [])]
      .filter((value): value is string => Boolean(value?.trim()))
      .join(" ") || null;

  return (
    <div className="bg-white">
      <CapsulePageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={supportingText}
        imageSrc={page.heroImage ?? "/images/randomPictures/studentsblueclothing.jpg"}
        imageAlt="Learners gathering for an ITFY training session"
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.apply.root, href: "/apply-for-training" },
          { label: breadcrumbs.apply.whoCanApply },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionIntro
            eyebrow="Overview"
            title={page.overviewTitle ?? "Different routes suit different starting points"}
            description={page.overviewDescription ??
              "Eligibility is not only about what a learner already knows. It is also about timing, commitment, and whether the course level matches what they need right now."}
          />

        <div className="mt-10 grid gap-x-10 gap-y-12 border-y border-brand-border py-10 lg:grid-cols-3">
          {audienceSections.map((card, index) => (
            <article
              key={card.title}
              className="relative"
            >
              <p className="font-heading text-5xl font-bold text-brand-mist">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-heading text-2xl font-bold text-brand-ink">{card.title}</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">{card.body}</p>
              {(card.bullets ?? []).length ? (
                <p className="mt-5 border-l-2 border-brand-accent pl-5 text-base leading-8 text-slate-700">
                  {(card.bullets ?? []).join(" ")}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* A full-bleed band. The section above is a bordered three-column
          numbered grid and the hero is a capsule, so the widest treatment here
          changes the pacing rather than adding a third contained plate. */}
      <MediaBand
        src="/images/randomPictures/redclothingStudents.jpg"
        alt="Learners working together around a shared table during a session"
        height="short"
      >
        <p className="flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-white">
          <span aria-hidden="true" className="h-[2px] w-6 flex-none bg-brand-accent" />
          {page.principlesEyebrow ?? "Who this is for"}
        </p>
        <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
          {page.principlesTitle ?? "Come as you are, and commit to the work"}
        </h2>
        <p className="mt-4 text-base leading-8 text-white/85">
          {page.principlesDescription ??
            "Eligibility is about timing and commitment as much as prior knowledge. If the level matches what you need right now, you are in the right place."}
        </p>
      </MediaBand>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-panel bg-brand-deep p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              {page.operatingEyebrow ?? "What helps"}
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold">
              {page.operatingTitle ?? "Readiness matters more than polish"}
            </h2>
            <p className="mt-4 text-base leading-8 text-white/78">
              {page.operatingDescription ??
                "Learners do not need to arrive with a perfect story. What matters more is whether they can engage honestly with the process and commit to showing up for the cohort."}
            </p>
          </div>

          {(readinessSection?.bullets ?? []).length ? (
            <div className="flex items-center border-y border-brand-border py-8 lg:px-6">
              <p className="text-lg leading-9 text-slate-700">
                {(readinessSection?.bullets ?? []).join(" ")}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionIntro
            eyebrow={page.exploreEyebrow ?? "Next steps"}
            title={page.exploreTitle ?? "Once the fit feels clearer, keep moving"}
            description={page.exploreDescription ??
                "The next best step is usually to browse the course catalog or understand the application sequence for Cohort 8."}
          />

          <RouteCardGrid cards={page.related} />
        </div>
      </section>
    </div>
  );
}
