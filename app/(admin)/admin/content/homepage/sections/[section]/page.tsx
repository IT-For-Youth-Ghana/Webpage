import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, GripVertical, Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { adminContentSections } from "@/lib/cms/admin-config";
import type {
  AdminHomepageSectionConfig,
  AdminMetric,
  AdminTableColumn,
} from "@/types/admin";

type AdminContentSectionPageProps = {
  params: { section: string };
};

export function generateStaticParams() {
  return Object.keys(adminContentSections).map((section) => ({ section }));
}

const sectionColumns: AdminTableColumn<AdminHomepageSectionConfig>[] = [
  {
    key: "label",
    label: "Section",
    render: (section) => (
      <div className="flex items-start gap-3">
        <span className="mt-1 text-slate-300">
          <GripVertical className="h-5 w-5" />
        </span>
        <div>
          <p className="font-bold text-slate-950">{section.label}</p>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
            {section.description}
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {section.id}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (section) => <AdminStatusPill status={section.status} />, 
  },
  {
    key: "collection",
    label: "Collection",
    render: (section) => (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
        {section.collection}
      </span>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (section) => (
      <div className="flex flex-wrap gap-2">
        <Link
          href={section.route}
          className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </Link>
      </div>
    ),
  },
];

export default function AdminContentSectionPage({ params }: AdminContentSectionPageProps) {
  const page = adminContentSections[params.section as keyof typeof adminContentSections];

  if (!page) {
    notFound();
  }

  const metrics: AdminMetric[] = [
    {
      label: "Visible sections",
      value: String(page.sections.filter((section) => section.status === "live").length),
      description: "Sections currently represented by live seed content.",
      status: "published",
    },
    {
      label: "Planned controls",
      value: String(page.sections.filter((section) => section.status === "planned").length),
      description: "Controls modeled now and ready for future Firebase writes.",
      status: "new",
    },
    {
      label: "Collections touched",
      value: String(new Set(page.sections.map((section) => section.collection)).size),
      description: "Distinct Firestore targets this screen will update.",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage CMS"
        title={page.title}
        description={page.description}
        primaryAction={{ label: "Preview homepage", href: "/" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={sectionColumns} rows={page.sections} />
    </div>
  );
}
