import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsTeamMembers } from "@/lib/cms/team";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";
import type { TeamMemberProfile } from "@/types/content";

const teamColumns: AdminTableColumn<TeamMemberProfile>[] = [
  {
    key: "name",
    label: "Team member",
    render: (member) => (
      <div>
        <p className="font-bold text-slate-950">{member.name}</p>
        <p className="mt-1 text-sm text-slate-600">{member.role}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {member.departmentSlug ? (
            <Link
              href={`/departments/${member.departmentSlug}`}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-brand-primary-light hover:text-brand-deep"
            >
              {member.department}
            </Link>
          ) : (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {member.department}
            </span>
          )}
          {member.featured && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
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
    render: (member) => <AdminStatusPill status={member.status === "active" ? "published" : "draft"} />,
  },
  {
    key: "order",
    label: "Ordering",
    render: (member) => <span className="font-semibold text-slate-800">{member.order}</span>,
  },
  {
    key: "actions",
    label: "Actions",
    render: (member) => (
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/team/${member.id}`}
          className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
      </div>
    ),
  },
];

export default async function AdminTeamPage() {
  const members = await getCmsTeamMembers(true);
  const featuredCount = members.filter((m) => m.featured).length;
  const departments = new Set(members.map((m) => m.department));

  const metrics: AdminMetric[] = [
    {
      label: "Total members",
      value: String(members.length),
      description: "All profiles including inactive; ordered by department and weight.",
      status: "active",
    },
    {
      label: "Featured",
      value: String(featuredCount),
      description: "Highlighted profiles used for public spotlights.",
      status: "published",
    },
    {
      label: "Departments",
      value: String(departments.size),
      description: "Unique departments represented across the team.",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="People & governance"
        title="Team manager"
        description="Create and manage team profiles. Supports featured status, department ordering, and rich bios via Firestore when configured."
        primaryAction={{ label: "Create team member", href: "/admin/team/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={teamColumns} rows={members} />
    </div>
  );
}
