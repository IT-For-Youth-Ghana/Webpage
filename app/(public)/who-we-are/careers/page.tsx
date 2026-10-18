import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";
import { CareersList } from "@/components/shared/careers-list";
import { getCmsJobs } from "@/lib/cms/jobs";
import { getCmsSitePage } from "@/lib/cms/site-pages";
import { careersHub } from "@/lib/content/site-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

/**
 * Metadata reads the same record the page renders, so an editor changing the
 * hub's title or hero photograph changes the search result and the share card
 * with it rather than leaving them behind.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = (await getCmsSitePage("careers")) ?? careersHub;

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: "/who-we-are/careers",
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function CareersPage() {
  const [page, jobs] = await Promise.all([
    getCmsSitePage("careers"),
    getCmsJobs(false),
  ]);

  return (
    <>
      <ContentPage page={page ?? careersHub} />
      <CareersList jobs={jobs} />
    </>
  );
}
