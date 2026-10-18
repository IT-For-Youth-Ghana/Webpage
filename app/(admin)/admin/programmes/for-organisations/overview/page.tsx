import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrganisationContentForm } from "@/components/admin/organisation-content-form";
import { getCmsOrganisationOverview } from "@/lib/cms/organisations";

export default async function AdminOrganisationOverviewPage() {
  const overview = await getCmsOrganisationOverview();
  return <div className="space-y-8">
    <AdminPageHeader eyebrow="Organisation CMS" title="For Organisations overview" description="Edit every section displayed on the public overview page." />
    <OrganisationContentForm kind="overview" initial={overview} />
  </div>;
}
