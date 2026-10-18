import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";
import { PartnerDirectory } from "@/components/shared/partner-directory";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsSitePage } from "@/lib/cms/site-pages";
import { partnersHub } from "@/lib/content/site-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

/**
 * Metadata reads the same record the page renders, so an editor changing the
 * hub's title or hero photograph changes the search result and the share card
 * with it rather than leaving them behind.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = (await getCmsSitePage("partners")) ?? partnersHub;

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: "/who-we-are/partners",
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function PartnersPage() {
  const [page, partners] = await Promise.all([
    getCmsSitePage("partners"),
    getCmsPartners(),
  ]);

  return (
    <>
      <ContentPage page={page ?? partnersHub} />
      <PartnerDirectory partners={partners} />
    </>
  );
}
