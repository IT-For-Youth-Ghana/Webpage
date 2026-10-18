import type { Metadata } from "next";

import { ImpactSdgsPage } from "@/components/impact/impact-sdgs-page";
import { getCmsImpactPage } from "@/lib/cms/impact-pages";
import { impactSdgsContent } from "@/lib/content/impact-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: impactSdgsContent.eyebrow,
  description: impactSdgsContent.description,
  path: "/our-impact/sdgs",
});

export default async function SdgsPage() {
  const content = await getCmsImpactPage("sdgs");

  return <ImpactSdgsPage content={content} />;
}
