import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { WhatWeDoOverviewForm } from "@/components/admin/what-we-do-forms";
import { getCmsInitiatives, getCmsWhatWeDoOverview } from "@/lib/cms/initiatives";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";
import type { InitiativePage } from "@/types/content";

const initiativeColumns: AdminTableColumn<InitiativePage>[] = [
  {
    key: "title",
    label: "Initiative",
    render: (initiative) => (
      <div>
        <p className="font-bold text-slate-950">{initiative.title}</p>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{initiative.description}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          /what-we-do/{initiative.slug}
        </p>
      </div>
    ),
  },
  {
    key: "stats",
    label: "Content",
    render: (initiative) => (
      <span className="font-semibold text-slate-800">
        {initiative.impactStats.length} stats · {initiative.gallery.length} images · {initiative.faqs.length} FAQs
      </span>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (initiative) => (
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/programmes/${initiative.slug}`}
          className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
        <Link
          href={`/what-we-do/${initiative.slug}`}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </Link>
      </div>
    ),
  },
];

export default async function AdminProgrammesPage() {
  const [overview, initiatives] = await Promise.all([
    getCmsWhatWeDoOverview(),
    getCmsInitiatives(),
  ]);

  const metrics: AdminMetric[] = [
    {
      label: "Initiative pages",
      value: String(initiatives.length),
      description: "Public What We Do subpages backed by the initiatives CMS collection.",
      status: "published",
    },
    {
      label: "Gallery assets",
      value: String(initiatives.reduce((count, initiative) => count + initiative.gallery.length, 0)),
      description: "Image records shown across initiative detail pages.",
      status: "active",
    },
    {
      label: "FAQs",
      value: String(initiatives.reduce((count, initiative) => count + initiative.faqs.length, 0)),
      description: "Question and answer records across all initiative pages.",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="What We Do CMS"
        title="Manage the What We Do overview and initiative pages"
        description="Edit the public What We Do hub and the dedicated initiative subpages. Saves update the CMS, revalidate the public route, and fall back to seed content when Firebase is not configured."
        primaryAction={{ label: "Preview What We Do", href: "/what-we-do" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <WhatWeDoOverviewForm
        endpoint="/api/admin/what-we-do"
        initial={overview}
      />

      <AdminDataTable columns={initiativeColumns} rows={initiatives} />
    </div>
  );
}
