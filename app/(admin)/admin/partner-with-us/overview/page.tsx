import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnershipOverviewForm } from "@/components/admin/partnership-overview-form";
import { getCmsPartnershipOverview } from "@/lib/cms/partnerships";

export default async function AdminPartnershipOverviewPage() {
  const overview = await getCmsPartnershipOverview();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Partnership CMS"
        title="Partner With Us overview"
        description="Edit the overview hero, stats, value cards, partner type cards, and next steps."
      />

      <PartnershipOverviewForm initial={overview} />
    </div>
  );
}
