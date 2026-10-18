import type { Metadata } from "next";

import { ForOrganisationsOverviewPage } from "@/components/organisations/for-organisations-overview-page";
import { organisationOverviewContent } from "@/lib/content/organisation-config";
import { getCmsOrganisationOverview, getCmsOrganisationServices } from "@/lib/cms/organisations";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: organisationOverviewContent.title,
  description: organisationOverviewContent.description,
  path: "/for-organisations",
});

export default async function ForOrganisationsPage() {
  const [content, services] = await Promise.all([getCmsOrganisationOverview(), getCmsOrganisationServices()]);
  return (
    <ForOrganisationsOverviewPage
      content={content}
      services={services}
    />
  );
}
