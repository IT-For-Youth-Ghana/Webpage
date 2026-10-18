import Link from "next/link";
import { Users } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsUsers } from "@/lib/cms/users";

type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export default async function AdminUsersPage() {
  const users = await getCmsUsers();
  const rows: Row[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="CMS"
        title="Users"
        description="Manage admin accounts, roles, and access status. Only super-admins can create, update, or delete accounts."
        icon={<Users className="h-6 w-6" />}
        primaryAction={{ label: "New user", href: "/admin/users/new" }}
      />

      <AdminDataTable
        columns={[
          { key: "name", label: "Name" },
          {
            key: "email",
            label: "Email",
            render: (row) => (
              <a href={`mailto:${(row as Row).email}`} className="text-brand-deep underline">
                {(row as Row).email}
              </a>
            ),
          },
          { key: "role", label: "Role" },
          {
            key: "status",
            label: "Status",
            render: (row) => <AdminStatusPill status={(row as Row).status} />,
          },
          {
            key: "actions",
            label: "",
            className: "text-right",
            render: (row) => (
              <Link
                href={`/admin/users/${(row as Row).id}`}
                className="text-sm font-semibold text-brand-deep hover:text-brand-ink"
              >
                Edit
              </Link>
            ),
          },
        ]}
        rows={rows}
        emptyMessage="No users yet. Create the first admin account."
      />
    </div>
  );
}
