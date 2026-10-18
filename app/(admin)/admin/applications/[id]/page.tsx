import { ClipboardList } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getCmsApplicationById } from "@/lib/cms/applications";
import { ApplicationForm } from "@/components/admin/application-form";

export default async function AdminEditApplicationPage({ params }: { params: { id: string } }) {
  const application = await getCmsApplicationById(params.id);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Applications CMS"
        title={application ? `Review: ${application.name}` : "Review application"}
        description="Update application status and internal notes."
        icon={<ClipboardList className="h-6 w-6" />}
      />
      {application ? (
        <ApplicationForm application={application} />
      ) : (
        <p className="rounded-[28px] border border-brand-border bg-white p-6 text-slate-600">This application could not be found.</p>
      )}
    </div>
  );
}
