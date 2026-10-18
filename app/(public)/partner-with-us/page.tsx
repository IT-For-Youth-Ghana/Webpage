import type { Metadata } from "next";

import { PartnerWithUsOverviewPage } from "@/components/partnerships/partner-with-us-overview-page";
import { getCmsPartnershipOverview, getCmsPartnershipTracks } from "@/lib/cms/partnerships";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Partner with us",
  description: "Work with IT For Youth Ghana through dedicated partner tracks.",
  path: "/partner-with-us",
});

export default async function PartnerWithUsPage() {
  const [content, tracks] = await Promise.all([
    getCmsPartnershipOverview(),
    getCmsPartnershipTracks(),
  ]);
  return <PartnerWithUsOverviewPage content={content} tracks={tracks} />;
}
