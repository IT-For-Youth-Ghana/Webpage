import { UsersRound } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SitePageForm } from "@/components/admin/site-page-form";
import { getCmsWhoWeArePage } from "@/lib/cms/site-pages";

export default async function AdminWhoWeArePage() {
  const page = await getCmsWhoWeArePage();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Site content"
        title="Who We Are page"
        description="Edit the public About hub: hero copy, stats, narrative sections, CTAs, and related routes."
        icon={<UsersRound className="h-5 w-5" />}
        primaryAction={{ label: "Preview page", href: "/who-we-are" }}
      />

      <SitePageForm
        initial={page}
        endpoint="/api/admin/site-content/who-we-are"
        previewHref="/who-we-are"
        submitLabel="Save Who We Are page"
      />
    </div>
  );
}
