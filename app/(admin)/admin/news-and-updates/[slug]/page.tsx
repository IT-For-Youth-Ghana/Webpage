import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NewsPageForm } from "@/components/admin/news-page-form";
import {
  getCmsNewsPage,
  isNewsPageSlug,
  newsPageLabels,
  newsPagePreviewPaths,
} from "@/lib/cms/news-pages";

type AdminNewsPageEditorProps = {
  params: { slug: string };
};

export default async function AdminNewsPageEditor({ params }: AdminNewsPageEditorProps) {
  if (!isNewsPageSlug(params.slug)) {
    notFound();
  }

  const page = await getCmsNewsPage(params.slug);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="News CMS"
        title={newsPageLabels[params.slug]}
        description="Edit the public-facing news page content with structured controls."
        primaryAction={{ label: "Preview page", href: newsPagePreviewPaths[params.slug] }}
      />

      <NewsPageForm
        slug={params.slug}
        initial={page}
        endpoint={`/api/admin/news-pages/${params.slug}`}
      />
    </div>
  );
}
