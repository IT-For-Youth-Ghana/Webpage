import type { Metadata } from "next";

import { WhatWeDoOverviewPage } from "@/components/what-we-do/what-we-do-overview-page";
import { getCmsInitiatives, getCmsWhatWeDoOverview } from "@/lib/cms/initiatives";
import { whatWeDoOverviewContent } from "@/lib/content/site-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: whatWeDoOverviewContent.eyebrow,
  description: whatWeDoOverviewContent.description,
  path: "/what-we-do",
});

export default async function WhatWeDoPage() {
  const [content, initiatives] = await Promise.all([
    getCmsWhatWeDoOverview(),
    getCmsInitiatives(),
  ]);

  return <WhatWeDoOverviewPage content={content} initiatives={initiatives} />;
}
