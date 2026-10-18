import { notFound } from "next/navigation";

import { ArticleForm } from "@/components/admin/article-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPublishBar } from "@/components/admin/admin-publish-bar";
import { getCmsArticleById } from "@/lib/cms/articles";

type AdminEditArticlePageProps = {
  params: { id: string };
};

export default async function AdminEditArticlePage({ params }: AdminEditArticlePageProps) {
  const article = await getCmsArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Article CRUD"
        title={`Edit: ${article.title}`}
        description="Update article metadata, publishing state, body HTML, author details, and SEO fields. Saving revalidates public article routes automatically."
      />

      <ArticleForm mode="edit" article={article} />

      <AdminPublishBar contentType="article" slugOrId={article.slug ?? article.id} previewHref={`/news-and-updates/${article.category}/${article.slug ?? ""}`} />
    </div>
  );
}
