import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticlePage } from "@/components/news/news-article-page";
import {
  getCmsArticleBySlug,
  getCmsPublishedArticles,
  getCmsRelatedArticles,
} from "@/lib/cms/articles";
import {
  isArticleCategory,
} from "@/lib/content/news-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

type ArticleDetailPageProps = {
  params: { category: string; slug: string };
};

export async function generateStaticParams() {
  return (await getCmsPublishedArticles()).map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const path = `/news-and-updates/${params.category}/${params.slug}`;
  const missing = {
    title: "Article not found",
    description: "This article does not exist.",
    path,
    noIndex: true,
  };

  if (!isArticleCategory(params.category)) {
    return pageMetadata(missing);
  }

  const article = await getCmsArticleBySlug(params.category, params.slug);

  if (!article) {
    return pageMetadata(missing);
  }

  return pageMetadata({
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.excerpt,
    path,
    image: article.seo?.ogImage ?? article.coverImage,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: article.author ? [article.author.name] : undefined,
  });
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  if (!isArticleCategory(params.category)) {
    notFound();
  }

  const article = await getCmsArticleBySlug(params.category, params.slug);

  if (!article) {
    notFound();
  }

  return (
    <NewsArticlePage
      article={article}
      relatedArticles={await getCmsRelatedArticles(article)}
    />
  );
}
