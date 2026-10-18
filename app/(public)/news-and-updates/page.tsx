import type { Metadata } from "next";

import { NewsHubPage } from "@/components/news/news-hub-page";
import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { getCmsNewsPage } from "@/lib/cms/news-pages";
import { newsHubContent } from "@/lib/content/news-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: newsHubContent.eyebrow,
  description: newsHubContent.description,
  path: "/news-and-updates",
});

export default async function NewsAndUpdatesPage() {
  const [content, articles] = await Promise.all([
    getCmsNewsPage("hub"),
    getCmsPublishedArticles(),
  ]);

  return (
    <NewsHubPage
      content={content}
      articles={articles}
    />
  );
}
