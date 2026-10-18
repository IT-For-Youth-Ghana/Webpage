import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PartnershipTrackPage as PartnershipTrackTemplate } from "@/components/partnerships/partnership-track-page";
import { partnershipTracks } from "@/lib/content/partnership-config";
import { getCmsPartnershipTrackBySlug } from "@/lib/cms/partnerships";
import { pageMetadata } from "@/lib/seo/page-metadata";

type PartnershipDetailPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return partnershipTracks.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: PartnershipDetailPageProps): Metadata {
  const page = partnershipTracks.find((entry) => entry.slug === params.slug);
  const path = `/partner-with-us/${params.slug}`;

  if (!page) {
    return pageMetadata({
      title: "Partnership track not found",
      description: "This partnership track does not exist.",
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

export default async function PartnershipDetailPage({ params }: PartnershipDetailPageProps) {
  const page = await getCmsPartnershipTrackBySlug(params.slug);
  if (!page) notFound();
  return <PartnershipTrackTemplate page={page} />;
}
