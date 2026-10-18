import { GraduationCap } from "lucide-react";

import { SitePageEditorShell } from "@/components/admin/site-page-editor-shell";
import { getCmsApplyForTrainingPage } from "@/lib/cms/site-pages";

export default async function AdminApplyForTrainingPage() {
  const page = await getCmsApplyForTrainingPage();

  return (
    <SitePageEditorShell
      page={page}
      eyebrow="Site content"
      title="Apply for Training page"
      description="Edit the public learner pathway hub: hero copy, stats, narrative sections, CTAs, and connected training routes."
      endpoint="/api/admin/site-content/apply-for-training"
      previewHref="/apply-for-training"
      submitLabel="Save Apply for Training page"
      icon={<GraduationCap className="h-5 w-5" />}
    />
  );
}
