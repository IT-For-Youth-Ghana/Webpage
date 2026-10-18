import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";

import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { InitiativeForm } from "@/components/admin/what-we-do-forms";
import { getCmsInitiativeBySlug, getCmsInitiatives } from "@/lib/cms/initiatives";
import type { AdminMetric } from "@/types/admin";

type AdminInitiativePageProps = {
  params: { initiative: string };
};

export async function generateStaticParams() {
  const initiatives = await getCmsInitiatives();
  return initiatives.map((initiative) => ({ initiative: initiative.slug }));
}

export default async function AdminInitiativePage({ params }: AdminInitiativePageProps) {
  const initiative = await getCmsInitiativeBySlug(params.initiative);

  if (!initiative) {
    notFound();
  }

  const metrics: AdminMetric[] = [
    {
      label: "Impact stats",
      value: String(initiative.impactStats.length),
      description: "Stats shown in the public impact section for this initiative.",
      status: "published",
    },
    {
      label: "Gallery assets",
      value: String(initiative.gallery.length),
      description: "Images shown in the initiative gallery section.",
      status: "active",
    },
    {
      label: "FAQs",
      value: String(initiative.faqs.length),
      description: "Questions shown near the bottom of the public page.",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Initiative CMS"
        title={`Edit ${initiative.title}`}
        description="Update the public initiative page: hero, overview, mission, objectives, process cards, impact stats, audience, gallery, testimonials, partners, FAQs, CTA, and related routes."
        primaryAction={{ label: "Preview public page", href: `/what-we-do/${initiative.slug}` }}
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/programmes"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to What We Do
        </Link>
        <Link
          href={`/what-we-do/${initiative.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
        >
          <Eye className="h-4 w-4" />
          Public route
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <InitiativeForm
        endpoint={`/api/admin/initiatives/${params.initiative}`}
        initial={initiative}
      />
    </div>
  );
}
