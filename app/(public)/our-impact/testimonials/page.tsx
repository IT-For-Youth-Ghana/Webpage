import type { Metadata } from "next";

import { ImpactTestimonialsPage } from "@/components/impact/impact-testimonials-page";
import { getCmsImpactPage } from "@/lib/cms/impact-pages";
import { impactTestimonialsContent } from "@/lib/content/impact-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: impactTestimonialsContent.eyebrow,
  description: impactTestimonialsContent.description,
  path: "/our-impact/testimonials",
});

export default async function TestimonialsPage() {
  const content = await getCmsImpactPage("testimonials");

  return <ImpactTestimonialsPage content={content} />;
}
