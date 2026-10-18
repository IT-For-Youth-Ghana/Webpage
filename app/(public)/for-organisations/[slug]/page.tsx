import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrganisationServicePage as OrganisationServiceTemplate } from "@/components/organisations/organisation-service-page";
import { organisationServices } from "@/lib/content/organisation-config";
import { getCmsOrganisationService } from "@/lib/cms/organisations";
import { pageMetadata } from "@/lib/seo/page-metadata";

type OrganisationServicePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return organisationServices.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: OrganisationServicePageProps): Metadata {
  const page = organisationServices.find((service) => service.slug === params.slug);
  const path = `/for-organisations/${params.slug}`;

  /* An unresolved slug 404s below, so its metadata must not describe a page
     that does not exist, and must not invite indexing of the URL. */
  if (!page) {
    return pageMetadata({
      title: "Service not found",
      description: "This organisation service does not exist.",
      path,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: page.title,
    description: page.description,
    path,
    image: page.heroImage,
  });
}

export default async function OrganisationServiceRoute({ params }: OrganisationServicePageProps) {
  const page = await getCmsOrganisationService(params.slug);
  if (!page) {
    notFound();
  }
  return <OrganisationServiceTemplate page={page} />;
}
