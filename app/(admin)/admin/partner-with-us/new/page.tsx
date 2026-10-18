import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnershipTrackForm } from "@/components/admin/partnership-track-form";

export default function AdminNewPartnershipTrackPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Partnership CMS"
        title="Create partner track"
        description="Add a new partner track page with top fields and JSON bridge sections."
      />

      <PartnershipTrackForm mode="create" />
    </div>
  );
}
