import Link from "next/link";
import { BarChart3, FileText, MessageSquareQuote, Pencil, Target } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  IMPACT_PAGE_SLUGS,
  impactPageLabels,
  impactPagePreviewPaths,
} from "@/lib/cms/impact-pages";

const icons = {
  overview: BarChart3,
  reports: FileText,
  testimonials: MessageSquareQuote,
  sdgs: Target,
};

export default function AdminOurImpactPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Impact CMS"
        title="Our Impact"
        description="Manage the public impact overview, reports, testimonials, and UN SDG pages with structured repeater controls."
        primaryAction={{ label: "Preview impact", href: "/our-impact" }}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {IMPACT_PAGE_SLUGS.map((slug) => {
          const Icon = icons[slug];

          return (
            <article
              key={slug}
              className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-deep text-brand-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
                      Impact page
                    </p>
                    <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
                      {impactPageLabels[slug]}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {impactPagePreviewPaths[slug]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/admin/our-impact/${slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
                <Link
                  href={impactPagePreviewPaths[slug]}
                  className="inline-flex items-center rounded-full border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-ink"
                >
                  Preview
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
