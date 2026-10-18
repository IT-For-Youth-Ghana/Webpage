import type { Metadata } from "next";

import { ImpactReportsPage as ImpactReportsTemplate } from "@/components/impact/impact-reports-page";
import { getCmsImpactPage } from "@/lib/cms/impact-pages";
import { impactReportsContent } from "@/lib/content/impact-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: impactReportsContent.eyebrow,
  description: impactReportsContent.description,
  path: "/our-impact/reports",
});

export default async function ImpactReportsPage() {
  const content = await getCmsImpactPage("reports");

  return <ImpactReportsTemplate content={content} />;
}
