import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsDepartments } from "@/lib/cms/departments";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";
import type { DepartmentProfile } from "@/types/content";

const departmentColumns: AdminTableColumn<DepartmentProfile>[] = [
  {
    key: "title",
    label: "Department",
    render: (department) => (
      <div>
        <p className="font-bold text-slate-950">{department.title}</p>
        <p className="mt-1 text-sm text-slate-600">{department.summary}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            /departments/{department.slug}
          </span>
          {department.featured && (
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
              Featured
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (department) => (
      <AdminStatusPill
        status={
          department.status === "published"
            ? "published"
            : department.status === "archived"
              ? "archived"
              : "draft"
        }
      />
    ),
  },
  {
    key: "order",
    label: "Order",
    render: (department) => <span className="font-semibold text-slate-800">{department.order}</span>,
  },
  {
    key: "actions",
    label: "Actions",
    render: (department) => (
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/departments/${department.slug}`}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
        <Link
          href={`/admin/departments/${department.id}`}
          className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
      </div>
    ),
  },
];

export default async function AdminDepartmentsPage() {
  const departments = await getCmsDepartments(true);
  const publishedCount = departments.filter((department) => department.status === "published").length;
  const featuredCount = departments.filter((department) => department.featured).length;

  const metrics: AdminMetric[] = [
    {
      label: "Departments",
      value: String(departments.length),
      description: "All department records, including drafts and archived pages.",
      status: "active",
    },
    {
      label: "Published",
      value: String(publishedCount),
      description: "Visible on the public departments index and detail pages.",
      status: "published",
    },
    {
      label: "Featured",
      value: String(featuredCount),
      description: "Highlighted departments for index-page emphasis.",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Organisation"
        title="Departments"
        description="Build public department pages with purpose, responsibilities, services, workflows, priorities, stats, resources, and team links."
        primaryAction={{ label: "Create department", href: "/admin/departments/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={departmentColumns} rows={departments} />
    </div>
  );
}
