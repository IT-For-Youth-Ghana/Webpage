import { Images } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HeroSlidesForm } from "@/components/admin/hero-slides-form";
import { getCmsHeroSlides } from "@/lib/cms/homepage";

export default async function AdminHeroSlidesPage() {
  const slides = await getCmsHeroSlides();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage CMS"
        title="Hero slides"
        description="Edit the JSON array of slides. Each slide supports eyebrow, heading, body, image, overlays, and CTA links."
        icon={<Images className="h-5 w-5" />}
      />

      <HeroSlidesForm initial={slides} />
    </div>
  );
}
