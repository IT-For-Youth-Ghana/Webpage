import { notFound } from "next/navigation";

import { ImpactPageForm } from "@/components/admin/impact-page-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  getCmsImpactPage,
  impactPageLabels,
  impactPagePreviewPaths,
  isImpactPageSlug,
} from "@/lib/cms/impact-pages";

type AdminImpactPageEditorProps = {
  params: { slug: string };
};

export default async function AdminImpactPageEditor({ params }: AdminImpactPageEditorProps) {
  if (!isImpactPageSlug(params.slug)) {
    notFound();
  }

  const page = await getCmsImpactPage(params.slug);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Impact CMS"
        title={impactPageLabels[params.slug]}
        description="Edit the public-facing impact content with structured repeaters, cards, lists, and page copy controls."
        primaryAction={{ label: "Preview page", href: impactPagePreviewPaths[params.slug] }}
      />

      <ImpactPageForm
        slug={params.slug}
        initial={page}
        endpoint={`/api/admin/impact-pages/${params.slug}`}
      />
    </div>
  );
}
