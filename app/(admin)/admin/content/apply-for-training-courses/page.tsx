import { ListChecks } from "lucide-react";

import { SitePageEditorShell } from "@/components/admin/site-page-editor-shell";
import { getCmsTrainingCoursesPage } from "@/lib/cms/site-pages";

export default async function AdminTrainingCoursesPage() {
  const page = await getCmsTrainingCoursesPage();

  return (
    <SitePageEditorShell
      page={page}
      eyebrow="Site content"
      title="Training Courses page"
      description="Edit the course catalog landing copy, comparison guidance, CTA routing, and related support cards."
      endpoint="/api/admin/site-content/apply-for-training-courses"
      previewHref="/apply-for-training/courses"
      submitLabel="Save Training Courses page"
      icon={<ListChecks className="h-5 w-5" />}
    />
  );
}
