import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsPartners } from "@/lib/cms/partners";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";
import type { Partner } from "@/components/home/patrners-strip";
import { PartnerReorderControls } from "@/components/admin/partner-reorder-controls";

const partnerColumns: AdminTableColumn<Partner>[] = [
  {
    key: "name",
    label: "Partner",
    render: (partner) => (
      <div>
        <p className="font-bold text-slate-950">{partner.name}</p>
        <p className="mt-1 text-sm text-slate-500">{partner.href || "No website URL"}</p>
      </div>
    ),
  },
  {
    key: "order",
    label: "Order",
    render: (partner) => <span className="text-sm font-semibold text-slate-700">{partner.order ?? 0}</span>,
  },
  {
    key: "active",
    label: "Status",
    render: (partner) => (
      <AdminStatusPill status={partner.active === false ? "draft" : "published"} />
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (partner) => (
      <Link
        href={`/admin/partners/${partner.id}`}
        className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>
    ),
  },
  {
    key: "reorder",
    label: "Reorder",
    render: (partner) => <PartnerReorderControls id={partner.id} order={partner.order ?? 0} />,
  },
];

export default async function AdminPartnersPage() {
  const partners = await getCmsPartners();
  const activePartners = partners.filter((partner) => partner.active !== false);

  const metrics: AdminMetric[] = [
    {
      label: "Total partners",
      value: String(partners.length),
      description: "Partner records resolved from CMS with seed fallback when unavailable.",
      status: "active",
    },
    {
      label: "Active",
      value: String(activePartners.length),
      description: "Currently visible on homepage strip and partner routes.",
      status: "published",
    },
    {
      label: "Hidden",
      value: String(partners.length - activePartners.length),
      description: "Profiles set as inactive for future use or temporary pause.",
      status: "draft",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Collaborations"
        title="Partner manager"
        description="Manage partner names, logos, links, and visibility used across the homepage and public partner pages."
        primaryAction={{ label: "Create partner", href: "/admin/partners/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={partnerColumns} rows={partners} />
    </div>
  );
}
