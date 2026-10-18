import type { ReactNode } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SitePageForm } from "@/components/admin/site-page-form";
import type { SitePage } from "@/types/content";

type SitePageEditorShellProps = {
  page: SitePage;
  eyebrow: string;
  title: string;
  description: string;
  endpoint: string;
  previewHref: string;
  submitLabel: string;
  icon?: ReactNode;
};

export function SitePageEditorShell({
  page,
  eyebrow,
  title,
  description,
  endpoint,
  previewHref,
  submitLabel,
  icon,
}: SitePageEditorShellProps) {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        icon={icon}
        primaryAction={{ label: "Preview page", href: previewHref }}
      />

      <SitePageForm
        initial={page}
        endpoint={endpoint}
        previewHref={previewHref}
        submitLabel={submitLabel}
      />
    </div>
  );
}
