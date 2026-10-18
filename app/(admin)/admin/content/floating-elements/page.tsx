import { Rocket } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FloatingElementsForm } from "@/components/admin/floating-elements-form";
import { getCmsFloatingElements } from "@/lib/cms/homepage";

export default async function AdminFloatingElementsPage() {
  const floating = await getCmsFloatingElements();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage CMS"
        title="Floating elements"
        description="Control the donate button, scroll-to-top visibility, and exit-intent newsletter."
        icon={<Rocket className="h-5 w-5" />}
      />

      <FloatingElementsForm initial={floating} />
    </div>
  );
}
