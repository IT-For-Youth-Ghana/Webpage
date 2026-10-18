import Link from "next/link";
import { Download, Mail, SlidersHorizontal } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsApplications } from "@/lib/cms/applications";
import { formatDate } from "@/lib/utils/formatters";
import type {
  AdminApplicationRecord,
  AdminMetric,
  AdminTableColumn,
} from "@/types/admin";

function getApplicationMetrics(applications: AdminApplicationRecord[]): AdminMetric[] {
  return [
    {
      label: "Total applications",
      value: String(applications.length),
      description: "Records available in the current application review queue.",
      status: "active",
    },
    {
      label: "Needs review",
      value: String(applications.filter((record) => record.status === "new").length),
      description: "Applications that should be reviewed first.",
      status: "new",
    },
    {
      label: "Shortlisted",
      value: String(applications.filter((record) => record.status === "shortlisted").length),
      description: "Learners ready for follow-up, interview, or cohort confirmation.",
      status: "shortlisted",
    },
    {
      label: "Enrolled",
      value: String(applications.filter((record) => record.status === "enrolled").length),
      description: "Applicants converted into confirmed learners.",
      status: "enrolled",
    },
  ];
}

const applicationColumns: AdminTableColumn<AdminApplicationRecord>[] = [
  {
    key: "name",
    label: "Applicant",
    render: (record) => (
      <div>
        <p className="font-bold text-slate-950">{record.name}</p>
        <p className="mt-1 text-sm text-slate-500">{record.email}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          {record.id}
        </p>
      </div>
    ),
  },
  {
    key: "course",
    label: "Course",
    render: (record) => (
      <div>
        <p className="font-semibold text-slate-800">{record.course}</p>
        <p className="mt-1 text-sm text-slate-500">Submitted {formatDate(record.submittedAt)}</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (record) => <AdminStatusPill status={record.status} />,
  },
  {
    key: "notes",
    label: "Internal notes",
    render: (record) => (
      <p className="max-w-md text-sm leading-6 text-slate-600">{record.notes}</p>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (record) => (
      <div className="flex flex-wrap gap-2">
        <a
          href={`mailto:${record.email}`}
          className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
        >
          <Mail className="h-3.5 w-3.5" />
          Email
        </a>
        <Link
          href={`/admin/applications/${record.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Review
        </Link>
      </div>
    ),
  },
];

export default async function AdminApplicationsPage() {
  const applications = await getCmsApplications();
  const applicationMetrics = getApplicationMetrics(applications);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Applications CMS"
        title="Learner application review"
        description="A seeded operational queue for the future Firestore applications collection. The status lifecycle follows the plan: new, reviewed, shortlisted, rejected, and enrolled."
        primaryAction={{ label: "Public apply route", href: "/apply-for-training" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {applicationMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters scaffold
        </button>
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
        >
          <Download className="h-4 w-4" />
          CSV export scaffold
        </Link>
      </div>

      <AdminDataTable columns={applicationColumns} rows={applications} />
    </div>
  );
}
