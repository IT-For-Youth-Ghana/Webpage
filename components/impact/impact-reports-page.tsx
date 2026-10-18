import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { VideoCard } from "@/components/media/video-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsSection } from "@/components/content/stats-section";
import type { ImpactReportsContent } from "@/types/content";

type ImpactReportsPageProps = {
  content: ImpactReportsContent;
};

const anchorLinks = [
  { id: "snapshot", label: "Snapshot" },
  { id: "reports", label: "Reports" },
  { id: "method", label: "Method" },
  { id: "next-steps", label: "Next Steps" },
];

export function ImpactReportsPage({ content }: ImpactReportsPageProps) {
  return (
    <div className="bg-white">
      <EditorialImageHero imageSrc={content.heroImage} imageAlt="IT For Youth Ghana impact reports and graduation moments" eyebrow={content.eyebrow} title={content.title} description={content.description} supportingText={content.methodologyPoints.filter((point) => point.trim()).slice(0, 3).join(" • ") || null} breadcrumbs={[{ label: breadcrumbs.home, href: "/" }, { label: breadcrumbs.impact.root, href: "/our-impact" }, { label: breadcrumbs.impact.reports }]} priority />

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
            eyebrow={content.snapshotSectionEyebrow ?? "Evidence snapshot"}
            title={
              content.snapshotSectionTitle ??
              "A quick view of the numbers before you open a brief"
            }
            description={
              content.snapshotSectionDescription ??
              "These top-line figures are meant to help readers orient themselves quickly before moving into the supporting documents and context below."
            }
          />
          <StatsSection stats={content.stats} />
        </div>
      </section>

      <section
        id="reports"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow={content.reportsSectionEyebrow ?? "Report briefs"}
            title={
              content.reportsSectionTitle ??
              "Open the latest evidence briefs and supporting notes"
            }
            description={
              content.reportsSectionDescription ??
              "These seeded report briefs give the route working downloads today, while leaving room for richer annual-report assets and PDFs later."
            }
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {content.reportResources.map((resource) => (
              <article
                key={resource.id}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
                      {resource.year}
                    </p>
                    <h2 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                      {resource.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-deep">
                    {content.reportBadgeLabel ?? "Brief"}
                  </span>
                </div>

                <p className="mt-4 text-base leading-7 text-slate-600">{resource.summary}</p>

                <div className="mt-5 space-y-3">
                  {resource.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>

                <a
                  href={resource.href}
                  download
                  className="mt-6 inline-flex rounded-full bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {resource.fileLabel}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <SectionHeading
              eyebrow={content.methodSectionEyebrow ?? "Reading the evidence"}
              title={
                content.methodSectionTitle ?? "What makes impact reporting credible here"
              }
              description={
                content.methodSectionDescription ??
                "These themes explain how the evidence is meant to be interpreted, especially by partners who need more than a simple list of metrics."
              }
            />
            <VideoCard
              thumbnail={content.heroImage}
              title={content.methodVideoTitle ?? content.title}
              videoUrl={content.methodVideoUrl}
              className="max-w-3xl lg:ml-auto"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {content.evidenceCards.map((card) => {
              const bulletParagraph = (card.bullets || [])
                .map((b) => (b || "").trim())
                .filter(Boolean)
                .map((b) => (/[.!?]$/.test(b) ? b : `${b}.`))
                .join(" ");
              const description = [card.description, bulletParagraph].filter(Boolean).join(" ");
              return (
                <div
                  key={card.title}
                  className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl" aria-hidden="true">
                      {card.icon}
                    </span>
                    <span className="rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-deep">
                      {content.methodCardBadgeLabel ?? "Evidence theme"}
                    </span>
                  </div>
                  <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[32px] bg-brand-deep p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              {content.methodBadgeEyebrow ?? "Method notes"}
            </p>
            {(() => {
              const notesParagraph = (content.methodologyPoints || [])
                .map((p) => (p || "").trim())
                .filter(Boolean)
                .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`))
                .join(" ");
              return (
                <p className="mt-6 text-base leading-8 text-white/82">
                  {notesParagraph}
                </p>
              );
            })()}
          </div>
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
              "Use the impact system based on what kind of proof you need next"
            }
            description={
              content.nextStepsSectionDescription ??
              "If the numbers raised questions, the stories and SDG routes below help provide the human and development context around them."
            }
          />
          <RouteCardGrid cards={content.related} />
        </div>
      </section>
    </div>
  );
}
