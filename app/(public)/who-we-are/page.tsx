import type { Metadata } from "next";

import { WhoWeArePage as WhoWeAreLandingPage } from "@/components/who-we-are/who-we-are-page";
import { getCmsWhoWeArePage } from "@/lib/cms/site-pages";
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsWhoWeArePage();

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: "/who-we-are",
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function WhoWeArePage() {
  const page = await getCmsWhoWeArePage();
  return <WhoWeAreLandingPage page={page} />;
}
