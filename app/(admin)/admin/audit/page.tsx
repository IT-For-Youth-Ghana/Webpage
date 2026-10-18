import { FileClock } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAuditLogs } from "@/lib/cms/audit";

export default async function AdminAuditPage() {
  const entries = await getAuditLogs(100);
  const rows = entries.map((e) => ({
    id: e.id,
    when: e.createdAt ?? "",
    action: e.action,
    resource: `${e.resourceType}/${e.resourceId}`,
    actor: e.actor?.email ?? "",
    role: e.actor?.role ?? "",
    summary: e.summary ?? "",
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="CMS"
        title="Audit log"
        description="Recent admin actions recorded for governance and traceability."
        icon={<FileClock className="h-6 w-6" />}
      />

      <AdminDataTable
        columns={[
          { key: "when", label: "When" },
          { key: "action", label: "Action" },
          { key: "resource", label: "Resource" },
          { key: "actor", label: "Actor" },
          { key: "role", label: "Role" },
          { key: "summary", label: "Summary" },
        ]}
        rows={rows}
        emptyMessage="No audit entries yet."
      />
    </div>
  );
}
