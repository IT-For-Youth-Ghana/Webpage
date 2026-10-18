import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SitePageForm } from "@/components/admin/site-page-form";
import { getCmsWhatWeDoDynamicPageBySlug } from "@/lib/cms/site-pages";

type AdminEditWhatWeDoDynamicPageProps = {
  params: { slug: string };
};

export default async function AdminEditWhatWeDoDynamicPage({
  params,
}: AdminEditWhatWeDoDynamicPageProps) {
  const page = await getCmsWhatWeDoDynamicPageBySlug(params.slug, true);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="What We Do"
        title={`Edit page: ${page.title || page.slug}`}
        description="Update the custom What We Do page content, route slug, publish status, CTAs, and related links."
        icon={<FileText className="h-5 w-5" />}
        primaryAction={{ label: "Preview page", href: `/what-we-do/${page.slug}` }}
      />

      <SitePageForm
        initial={page}
        endpoint={`/api/admin/what-we-do-pages/${page.slug}`}
        previewHref={`/what-we-do/${page.slug}`}
        submitLabel="Save page"
        method="PUT"
        showSlugField
        showPublishingFields
        slugBasePath="/what-we-do"
      />
    </div>
  );
}
