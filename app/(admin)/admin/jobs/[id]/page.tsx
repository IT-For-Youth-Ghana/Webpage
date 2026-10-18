import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { JobForm } from "@/components/admin/job-form";
import { getCmsJobById } from "@/lib/cms/jobs";

type AdminEditJobPageProps = {
  params: { id: string };
};

export default async function AdminEditJobPage({ params }: AdminEditJobPageProps) {
  const job = await getCmsJobById(params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Careers"
        title={`Edit job listing: ${job.title}`}
        description="Update role details, publication status, and application link."
      />

      <JobForm mode="edit" job={job} />
    </div>
  );
}
