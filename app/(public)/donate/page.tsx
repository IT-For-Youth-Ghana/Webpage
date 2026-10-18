import type { Metadata } from "next";

import { DonationCampaign } from "@/components/home/donation-campaign";
import { getCmsDonationCampaign } from "@/lib/cms/homepage";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Donate",
  description:
    "Support scholarships, devices, mentorship, and measurable pathways into work and enterprise for young Ghanaians.",
  path: "/donate",
});

/**
 * The donate page.
 *
 * This previously imported activeDonationCampaign straight from the seed file,
 * which meant the page handling money was the one page an administrator could
 * not edit: campaign copy, targets and deadlines were only changeable by a
 * developer and a redeploy. It reads through getCmsDonationCampaign now, the
 * same reader the homepage block uses, so the existing editor at
 * /admin/content/donation-campaign drives both.
 */
export default async function DonatePage() {
  const campaign = await getCmsDonationCampaign();

  return <DonationCampaign campaign={campaign} />;
}
