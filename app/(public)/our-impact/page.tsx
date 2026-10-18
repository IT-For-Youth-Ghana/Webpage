import type { Metadata } from "next";

import { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import { getCmsImpactPage } from "@/lib/cms/impact-pages";
import { getCmsPartners } from "@/lib/cms/partners";
import { impactOverviewContent } from "@/lib/content/impact-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: impactOverviewContent.eyebrow,
  description: impactOverviewContent.description,
  path: "/our-impact",
});

export default async function OurImpactPage() {
  const [content, partners] = await Promise.all([
    getCmsImpactPage("overview"),
    getCmsPartners(),
  ]);

  return <ImpactOverviewPage content={content} partners={partners} />;
}
