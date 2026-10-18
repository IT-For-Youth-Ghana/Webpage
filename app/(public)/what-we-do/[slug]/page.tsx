import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/shared/content-page";
import { InitiativePageTemplate } from "@/components/what-we-do/initiative-page";
import { getCmsInitiativeBySlug, getCmsInitiatives } from "@/lib/cms/initiatives";
import {
  getCmsWhatWeDoDynamicPageBySlug,
  getCmsWhatWeDoDynamicPages,
} from "@/lib/cms/site-pages";
import { pageMetadata } from "@/lib/seo/page-metadata";

type InitiativePageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const [initiatives, pages] = await Promise.all([
    getCmsInitiatives(),
    getCmsWhatWeDoDynamicPages(),
  ]);

  return [
    ...initiatives.map((initiative) => ({ slug: initiative.slug })),
    ...pages.map((page) => ({ slug: page.slug })),
  ];
}

export async function generateMetadata({ params }: InitiativePageProps): Promise<Metadata> {
  const page =
    (await getCmsInitiativeBySlug(params.slug)) ??
    (await getCmsWhatWeDoDynamicPageBySlug(params.slug));

  const path = `/what-we-do/${params.slug}`;

  if (!page) {
    return pageMetadata({
      title: "Initiative not found",
      description: "This initiative does not exist.",
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

export default async function InitiativePage({ params }: InitiativePageProps) {
  const initiative = await getCmsInitiativeBySlug(params.slug);

  if (initiative) {
    return <InitiativePageTemplate page={initiative} />;
  }

  const page = await getCmsWhatWeDoDynamicPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return <ContentPage page={page} />;
}
