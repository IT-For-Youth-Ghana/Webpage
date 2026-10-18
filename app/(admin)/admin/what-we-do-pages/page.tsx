import Link from "next/link";
import { Eye, FilePlus2, Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsWhatWeDoDynamicPages } from "@/lib/cms/site-pages";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";
import type { DynamicSitePage } from "@/types/content";

const columns: AdminTableColumn<DynamicSitePage>[] = [
  {
    key: "title",
    label: "Page",
    render: (page) => (
      <div>
        <p className="font-bold text-slate-950">{page.title || "Untitled page"}</p>
        <p className="mt-1 text-sm text-slate-600">{page.description}</p>
        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          /what-we-do/{page.slug}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (page) => <AdminStatusPill status={page.status} />,
  },
  {
    key: "order",
    label: "Order",
    render: (page) => <span className="font-semibold text-slate-800">{page.order}</span>,
  },
  {
    key: "actions",
    label: "Actions",
    render: (page) => (
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/what-we-do/${page.slug}`}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
        <Link
          href={`/admin/what-we-do-pages/${page.slug}`}
          className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
      </div>
    ),
  },
];

export default async function AdminWhatWeDoDynamicPagesPage() {
  const pages = await getCmsWhatWeDoDynamicPages(true);
  const publishedCount = pages.filter((page) => page.status === "published").length;

  const metrics: AdminMetric[] = [
    {
      label: "Custom pages",
      value: String(pages.length),
      description: "Dynamic pages created below the What We Do hub.",
      status: "active",
    },
    {
      label: "Published",
      value: String(publishedCount),
      description: "Visible at /what-we-do/{slug}.",
      status: "published",
    },
    {
      label: "Drafts",
      value: String(pages.length - publishedCount),
      description: "Prepared but not visible publicly.",
      status: "draft",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="What We Do"
        title="Custom pages"
        description="Create extra public pages below the What We Do section for special programme explainers, methods, resources, or portfolio pages that are not one of the core initiatives."
        icon={<FilePlus2 className="h-5 w-5" />}
        primaryAction={{ label: "Create page", href: "/admin/what-we-do-pages/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={columns} rows={pages} emptyMessage="No custom What We Do pages yet." />
    </div>
  );
}
