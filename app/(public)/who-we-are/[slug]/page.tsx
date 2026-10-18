import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/shared/content-page";
import {
  getCmsWhoWeAreDynamicPageBySlug,
  getCmsWhoWeAreDynamicPages,
} from "@/lib/cms/site-pages";
import { pageMetadata } from "@/lib/seo/page-metadata";

type WhoWeAreDynamicPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const pages = await getCmsWhoWeAreDynamicPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: WhoWeAreDynamicPageProps): Promise<Metadata> {
  const page = await getCmsWhoWeAreDynamicPageBySlug(params.slug);

  const path = `/who-we-are/${params.slug}`;

  if (!page) {
    return pageMetadata({
      title: "Page not found",
      description: "This page does not exist.",
      path,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: page.title,
    description: page.description,
    path,
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function WhoWeAreDynamicPage({ params }: WhoWeAreDynamicPageProps) {
  const page = await getCmsWhoWeAreDynamicPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return <ContentPage page={page} />;
}
