import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SitePageForm } from "@/components/admin/site-page-form";
import { getCmsWhoWeAreDynamicPageBySlug } from "@/lib/cms/site-pages";

type AdminEditWhoWeAreDynamicPageProps = {
  params: { slug: string };
};

export default async function AdminEditWhoWeAreDynamicPage({
  params,
}: AdminEditWhoWeAreDynamicPageProps) {
  const page = await getCmsWhoWeAreDynamicPageBySlug(params.slug, true);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Who We Are"
        title={`Edit page: ${page.title || page.slug}`}
        description="Update the custom page content, route slug, publish status, CTAs, and related links."
        icon={<FileText className="h-5 w-5" />}
        primaryAction={{ label: "Preview page", href: `/who-we-are/${page.slug}` }}
      />

      <SitePageForm
        initial={page}
        endpoint={`/api/admin/who-we-are-pages/${page.slug}`}
        previewHref={`/who-we-are/${page.slug}`}
        submitLabel="Save page"
        method="PUT"
        showSlugField
        showPublishingFields
      />
    </div>
  );
}
