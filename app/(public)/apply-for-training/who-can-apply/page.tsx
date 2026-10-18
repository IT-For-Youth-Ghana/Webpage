import type { Metadata } from "next";

import { TrainingWhoCanApplyPage } from "@/components/training/training-who-can-apply-page";
import { getCmsTrainingWhoCanApplyPage } from "@/lib/cms/site-pages";
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsTrainingWhoCanApplyPage();

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: "/apply-for-training/who-can-apply",
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function WhoCanApplyPage() {
  const page = await getCmsTrainingWhoCanApplyPage();

  return <TrainingWhoCanApplyPage page={page} />;
}
