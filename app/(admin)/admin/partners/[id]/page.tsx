import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnerForm } from "@/components/admin/partner-form";
import { getCmsPartnerById } from "@/lib/cms/partners";

type AdminEditPartnerPageProps = {
  params: { id: string };
};

export default async function AdminEditPartnerPage({ params }: AdminEditPartnerPageProps) {
  const partner = await getCmsPartnerById(params.id);

  if (!partner) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Collaborations"
        title={`Edit partner: ${partner.name}`}
        description="Update partner name, logo, destination URL, and public visibility."
      />

      <PartnerForm mode="edit" partner={partner} />
    </div>
  );
}
