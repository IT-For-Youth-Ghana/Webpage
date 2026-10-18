import { FilePlus2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SitePageForm } from "@/components/admin/site-page-form";
import { getEmptyWhatWeDoDynamicPage } from "@/lib/cms/site-pages";

export default function AdminNewWhatWeDoDynamicPage() {
  const page = getEmptyWhatWeDoDynamicPage();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="What We Do"
        title="Create custom page"
        description="Build a new public page under the What We Do section, then add a route card from the What We Do overview or another relevant page when it should be promoted."
        icon={<FilePlus2 className="h-5 w-5" />}
        primaryAction={{ label: "Back to pages", href: "/admin/what-we-do-pages" }}
      />

      <SitePageForm
        initial={page}
        endpoint="/api/admin/what-we-do-pages"
        previewHref="/what-we-do"
        submitLabel="Create page"
        method="POST"
        showSlugField
        showPublishingFields
        slugBasePath="/what-we-do"
        successRedirectHref="/admin/what-we-do-pages"
      />
    </div>
  );
}
