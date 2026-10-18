import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getCmsPartnershipTracks } from "@/lib/cms/partnerships";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";
import type { PartnershipTrackPage } from "@/types/content";

const columns: AdminTableColumn<PartnershipTrackPage>[] = [
  {
    key: "title",
    label: "Track",
    render: (row) => (
      <div>
        <p className="font-bold text-slate-950">{row.title}</p>
        <p className="mt-1 text-sm text-slate-500">/{row.slug}</p>
      </div>
    ),
  },
  {
    key: "eyebrow",
    label: "Eyebrow",
    render: (row) => <span className="text-sm font-semibold text-slate-700">{row.eyebrow}</span>,
  },
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <Link href={`/admin/partner-with-us/${row.slug}`} className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white">
        <Pencil className="h-3.5 w-3.5" /> Edit
      </Link>
    ),
  },
];

export default async function AdminPartnerWithUsPage() {
  const tracks = await getCmsPartnershipTracks();

  const metrics: AdminMetric[] = [
    {
      label: "Partner tracks",
      value: String(tracks.length),
      description: "CMS-managed tracks with seed fallback.",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Partnership CMS"
        title="Partner With Us"
        description="Manage partner tracks (educational, government, NGOs & foundations, international development, technology companies) and overview copy."
        primaryAction={{ label: "New partner track", href: "/admin/partner-with-us/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((m) => (
          <AdminMetricCard key={m.label} metric={m} />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <Link href="/admin/partner-with-us/new" className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink">
          <Plus className="h-4 w-4" /> Create partner track
        </Link>
        <Link href="/admin/partner-with-us/overview" className="text-sm font-semibold text-brand-deep">Edit overview</Link>
      </div>

      <AdminDataTable columns={columns} rows={tracks} />
    </div>
  );
}
