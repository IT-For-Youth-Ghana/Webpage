import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnerForm } from "@/components/admin/partner-form";

export default function AdminNewPartnerPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Collaborations"
        title="Create partner"
        description="Add a new partner profile for homepage strip and public partnership visibility."
      />

      <PartnerForm mode="create" />
    </div>
  );
}
