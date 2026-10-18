import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsListingPage } from "@/components/news/news-listing-page";
import {
  getCmsArticleTags,
  getCmsArticlesByCategory,
} from "@/lib/cms/articles";
import { getCmsArticleCategoryContent } from "@/lib/cms/news-pages";
import {
  articleCategories,
  articleCategoryLabels,
  isArticleCategory,
} from "@/lib/content/news-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

type ArticleCategoryPageProps = {
  params: { category: string };
};

export function generateStaticParams() {
  return articleCategories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: ArticleCategoryPageProps): Promise<Metadata> {
  // An unknown category 404s below. Canonicalise it to the hub and keep it
  // out of the index rather than describing a listing that does not exist.
  if (!isArticleCategory(params.category)) {
    return pageMetadata({
      title: "Category not found",
      description: "This news category does not exist.",
      path: "/news-and-updates",
      noIndex: true,
    });
  }

  const content = await getCmsArticleCategoryContent(params.category);

  return pageMetadata({
    title: articleCategoryLabels[params.category],
    description: content.description,
    path: `/news-and-updates/${params.category}`,
    image: content.heroImage,
  });
}

export default async function ArticleCategoryPage({
  params,
}: ArticleCategoryPageProps) {
  if (!isArticleCategory(params.category)) {
    notFound();
  }

  const [content, articles, tags] = await Promise.all([
    getCmsArticleCategoryContent(params.category),
    getCmsArticlesByCategory(params.category),
    getCmsArticleTags(params.category),
  ]);

  return (
    <NewsListingPage
      content={content}
      articles={articles}
      tags={tags}
    />
  );
}
