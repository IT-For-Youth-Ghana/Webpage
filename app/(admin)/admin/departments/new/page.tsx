import { DepartmentForm } from "@/components/admin/department-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminNewDepartmentPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Organisation"
        title="Create department"
        description="Add a department page with responsibilities, services, workflows, priorities, resources, and public CTAs."
      />

      <DepartmentForm mode="create" />
    </div>
  );
}
