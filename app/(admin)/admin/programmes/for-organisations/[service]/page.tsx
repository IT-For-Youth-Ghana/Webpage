import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrganisationContentForm } from "@/components/admin/organisation-content-form";
import { getCmsOrganisationService } from "@/lib/cms/organisations";

export default async function AdminOrganisationServicePage({ params }: { params: { service: string } }) {
  const service = await getCmsOrganisationService(params.service);
  if (!service) notFound();
  return <div className="space-y-8">
    <AdminPageHeader eyebrow="Organisation CMS" title={`Edit service: ${service.title}`} description="Edit the hero, section framing, cards, process, case studies, packages, FAQs, CTA, and related routes." primaryAction={{ label: "Preview public page", href: `/for-organisations/${service.slug}` }} />
    <OrganisationContentForm kind="service" initial={service} />
  </div>;
}
