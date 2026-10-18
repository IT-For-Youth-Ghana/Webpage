import type { Metadata } from "next";

import { ApplyForTrainingOverviewPage } from "@/components/training/apply-for-training-overview-page";
import { getCmsApplyForTrainingPage } from "@/lib/cms/site-pages";
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsApplyForTrainingPage();

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: "/apply-for-training",
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function ApplyForTrainingPage() {
  const page = await getCmsApplyForTrainingPage();

  return (
    <ApplyForTrainingOverviewPage
      page={page}
      cohorts={page.cohorts ?? []}
      process={page.process ?? []}
    />
  );
}
