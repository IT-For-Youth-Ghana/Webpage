import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamForm } from "@/components/admin/team-form";
import { getCmsDepartments } from "@/lib/cms/departments";

export default async function AdminNewTeamMemberPage() {
  const departments = await getCmsDepartments(true);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="People & governance"
        title="Create team member"
        description="Add a new team profile with department grouping, ordering, and optional public contact links."
      />

      <TeamForm mode="create" departments={departments} />
    </div>
  );
}
