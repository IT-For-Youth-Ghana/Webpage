import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnershipTrackForm } from "@/components/admin/partnership-track-form";
import { getCmsPartnershipTrackBySlug } from "@/lib/cms/partnerships";

type Props = { params: { slug: string } };

export default async function AdminEditPartnershipTrackPage({ params }: Props) {
  const track = await getCmsPartnershipTrackBySlug(params.slug);
  if (!track) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Partnership CMS"
        title={`Edit track: ${track.title}`}
        description="Update the partner track content and JSON sections."
      />

      <PartnershipTrackForm mode="edit" initial={track} />
    </div>
  );
}
