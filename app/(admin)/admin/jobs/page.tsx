import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsJobs } from "@/lib/cms/jobs";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";
import type { JobListing } from "@/types/content";

const jobColumns: AdminTableColumn<JobListing>[] = [
  {
    key: "title",
    label: "Role",
    render: (job) => (
      <div>
        <p className="font-bold text-slate-950">{job.title}</p>
        <p className="mt-1 text-sm text-slate-600">{job.team} · {job.location}</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{job.summary}</p>
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (job) => <span className="text-sm font-semibold text-slate-700 capitalize">{job.type.replace("-", " ")}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (job) => <AdminStatusPill status={job.status === "published" ? "published" : "draft"} />,
  },
  {
    key: "actions",
    label: "Actions",
    render: (job) => (
      <Link
        href={`/admin/jobs/${job.id}`}
        className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>
    ),
  },
];

export default async function AdminJobsPage() {
  const jobs = await getCmsJobs(true);
  const published = jobs.filter((job) => job.status === "published");
  const open = published.filter((job) => job.status === "published");

  const metrics: AdminMetric[] = [
    {
      label: "Total roles",
      value: String(jobs.length),
      description: "All jobs and volunteer opportunities currently in the CMS.",
      status: "active",
    },
    {
      label: "Published",
      value: String(published.length),
      description: "Roles currently visible on the public careers page.",
      status: "published",
    },
    {
      label: "Drafts",
      value: String(jobs.length - open.length),
      description: "Roles staged for review before publishing.",
      status: "draft",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Careers"
        title="Job listings manager"
        description="Manage open roles, volunteer opportunities, and publication state for the careers page."
        primaryAction={{ label: "Create job listing", href: "/admin/jobs/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={jobColumns} rows={jobs} />
    </div>
  );
}
