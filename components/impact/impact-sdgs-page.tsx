import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsSection } from "@/components/content/stats-section";
import { VideoCard } from "@/components/media/video-card";
import type { ImpactSdgsContent } from "@/types/content";

type ImpactSdgsPageProps = {
  content: ImpactSdgsContent;
};

const anchorLinks = [
  { id: "snapshot", label: "Snapshot" },
  { id: "goals", label: "Goals" },
  { id: "principles", label: "Principles" },
  { id: "next-steps", label: "Next Steps" },
];

export function ImpactSdgsPage({ content }: ImpactSdgsPageProps) {
  return (
    <div className="bg-white">
      <EditorialImageHero imageSrc={content.heroImage} imageAlt="UN SDG alignment across IT For Youth Ghana impact areas" eyebrow={content.eyebrow} title={content.title} description={content.description} supportingText={content.alignmentPrinciples.filter((point) => point.trim()).slice(0, 3).join(" • ") || null} breadcrumbs={[{ label: breadcrumbs.home, href: "/" }, { label: breadcrumbs.impact.root, href: "/our-impact" }, { label: breadcrumbs.impact.sdgs }]} priority />

      <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <section id="snapshot" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={content.snapshotSectionEyebrow ?? "Impact snapshot"}
            title={
              content.snapshotSectionTitle ??
              "The same headline evidence can be read through a development lens"
            }
            description={
              content.snapshotSectionDescription ??
              "These top-line metrics help anchor the SDG conversation in the same real programme evidence used elsewhere on the site."
            }
          />
          <StatsSection stats={content.stats} />
        </div>
      </section>

      <section
        id="goals"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow={content.goalsSectionEyebrow ?? "Goal mapping"}
            title={
              content.goalsSectionTitle ??
              "The work contributes across education, inclusion, opportunity, innovation, and partnership goals"
            }
            description={
              content.goalsSectionDescription ??
              "The mapping below is meant to help partners and funders understand relevance without flattening the local programme logic that actually drives the work."
            }
          />

          <div className="space-y-6">
            {content.goals.map((goal) => (
              <div
                key={goal.goal}
                className="grid gap-6 rounded-[32px] border border-brand-border bg-white p-7 shadow-sm lg:grid-cols-[0.38fr_0.62fr]"
              >
                <div className="space-y-4 rounded-[28px] bg-brand-deep p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl" aria-hidden="true">
                      {goal.icon}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-accent">
                      {goal.goal}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl font-bold">{goal.title}</h2>
                  <p className="text-base leading-7 text-white/78">{goal.summary}</p>
                </div>

                <div className="space-y-5">
                  {(() => {
                    const contributionsParagraph = (goal.contributions || [])
                      .map((c) => (c || "").trim())
                      .filter(Boolean)
                      .map((c) => (/[.!?]$/.test(c) ? c : `${c}.`))
                      .join(" ");
                    return (
                      <p className="text-base leading-7 text-slate-700">{contributionsParagraph}</p>
                    );
                  })()}

                  <div className="grid gap-4 md:grid-cols-2">
                    {goal.linkedRoutes.map((route) => (
                      <Link
                        key={`${goal.goal}-${route.href}`}
                        href={route.href}
                        className="rounded-[24px] border border-brand-border bg-white p-5 transition hover:-translate-y-1 hover:shadow-sm"
                      >
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.26em] text-brand-accent">
                          {route.eyebrow}
                        </p>
                        <h3 className="mt-3 font-heading text-2xl font-bold text-brand-ink">
                          {route.title}
                        </h3>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                          {route.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="principles" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <SectionHeading
              eyebrow={content.principlesSectionEyebrow ?? "Alignment principles"}
              title={
                content.principlesSectionTitle ??
                "How the SDG lens is meant to be used here"
              }
              description={
                content.principlesSectionDescription ??
                "The goal mapping helps translate the work for development audiences, but it should always stay anchored in the lived local reality of the programmes."
              }
            />
            <VideoCard
              thumbnail={content.heroImage}
              title={content.principlesVideoTitle ?? content.title}
              videoUrl={content.principlesVideoUrl}
              className="max-w-3xl lg:ml-auto"
            />
          </div>

          {(() => {
            const principlesParagraph = (content.alignmentPrinciples || [])
              .map((p) => (p || "").trim())
              .filter(Boolean)
              .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`))
              .join(" ");
            return (
              <p className="rounded-[26px] border border-brand-border bg-white px-5 py-5 text-base leading-7 text-slate-700 shadow-sm">{principlesParagraph}</p>
            );
          })()}
        </div>
      </section>

      <section
        id="next-steps"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow={content.nextStepsSectionEyebrow ?? "Next steps"}
            title={
              content.nextStepsSectionTitle ??
              "Move into the route that adds the next layer of context"
            }
            description={
              content.nextStepsSectionDescription ??
              "If the development lens is useful, the routes below help connect it to the partnership and evidence pages that support deeper conversations."
            }
          />
          <RouteCardGrid cards={content.related} />
        </div>
      </section>
    </div>
  );
}
