import { FilePlus2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SitePageForm } from "@/components/admin/site-page-form";
import { getEmptyWhoWeAreDynamicPage } from "@/lib/cms/site-pages";

export default function AdminNewWhoWeAreDynamicPage() {
  const page = getEmptyWhoWeAreDynamicPage();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Who We Are"
        title="Create custom page"
        description="Build a new public page under the Who We Are section, then add a related route card on the main Who We Are page when it should appear as a CTA."
        icon={<FilePlus2 className="h-5 w-5" />}
        primaryAction={{ label: "Back to pages", href: "/admin/who-we-are-pages" }}
      />

      <SitePageForm
        initial={page}
        endpoint="/api/admin/who-we-are-pages"
        previewHref="/who-we-are"
        submitLabel="Create page"
        method="POST"
        showSlugField
        showPublishingFields
        successRedirectHref="/admin/who-we-are-pages"
      />
    </div>
  );
}
