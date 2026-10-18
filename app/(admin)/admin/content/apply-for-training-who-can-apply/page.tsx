import { BadgeCheck } from "lucide-react";

import { SitePageEditorShell } from "@/components/admin/site-page-editor-shell";
import { getCmsTrainingWhoCanApplyPage } from "@/lib/cms/site-pages";

export default async function AdminTrainingWhoCanApplyPage() {
  const page = await getCmsTrainingWhoCanApplyPage();

  return (
    <SitePageEditorShell
      page={page}
      eyebrow="Site content"
      title="Who Can Apply page"
      description="Edit eligibility guidance, learner profiles, readiness copy, CTAs, and related route cards."
      endpoint="/api/admin/site-content/apply-for-training-who-can-apply"
      previewHref="/apply-for-training/who-can-apply"
      submitLabel="Save Who Can Apply page"
      icon={<BadgeCheck className="h-5 w-5" />}
    />
  );
}
