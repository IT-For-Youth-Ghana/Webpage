import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { JobForm } from "@/components/admin/job-form";

export default function AdminNewJobPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Careers"
        title="Create job listing"
        description="Add a new role with team, location, status, and application details."
      />

      <JobForm mode="create" />
    </div>
  );
}
