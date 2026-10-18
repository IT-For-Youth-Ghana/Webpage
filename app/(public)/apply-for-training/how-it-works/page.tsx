import type { Metadata } from "next";

import { TrainingHowItWorksPage } from "@/components/training/training-how-it-works-page";
import { getCmsTrainingHowItWorksPage } from "@/lib/cms/site-pages";
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsTrainingHowItWorksPage();

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: "/apply-for-training/how-it-works",
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function HowItWorksPage() {
  const page = await getCmsTrainingHowItWorksPage();

  return <TrainingHowItWorksPage page={page} />;
}
