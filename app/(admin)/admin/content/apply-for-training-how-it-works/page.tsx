import { Route } from "lucide-react";

import { SitePageEditorShell } from "@/components/admin/site-page-editor-shell";
import { getCmsTrainingHowItWorksPage } from "@/lib/cms/site-pages";

export default async function AdminTrainingHowItWorksPage() {
  const page = await getCmsTrainingHowItWorksPage();

  return (
    <SitePageEditorShell
      page={page}
      eyebrow="Site content"
      title="How It Works page"
      description="Edit the application journey, timeline guidance, preparation checklist, CTAs, and related route cards."
      endpoint="/api/admin/site-content/apply-for-training-how-it-works"
      previewHref="/apply-for-training/how-it-works"
      submitLabel="Save How It Works page"
      icon={<Route className="h-5 w-5" />}
    />
  );
}
