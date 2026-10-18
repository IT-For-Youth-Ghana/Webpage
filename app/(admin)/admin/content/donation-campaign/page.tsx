import { HandCoins } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DonationCampaignForm } from "@/components/admin/donation-campaign-form";
import { getCmsDonationCampaign } from "@/lib/cms/homepage";

export default async function AdminDonationCampaignPage() {
  const campaign = await getCmsDonationCampaign();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage CMS"
        title="Donation campaign"
        description="Edit the active donation campaign content and CTAs."
        icon={<HandCoins className="h-5 w-5" />}
      />

      <DonationCampaignForm initial={campaign} />
    </div>
  );
}
