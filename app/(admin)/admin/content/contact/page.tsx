import { Mail } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContactPageForm } from "@/components/admin/contact-page-form";
import { getCmsContactPage } from "@/lib/cms/contact";

export default async function AdminContactPage() {
  const content = await getCmsContactPage();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Site content"
        title="Contact Page"
        description="Manage the public contact page hero, direct channels, enquiry options, response steps, and routing cards."
        icon={<Mail className="h-5 w-5" />}
        primaryAction={{ label: "Preview contact page", href: "/contact" }}
      />

      <ContactPageForm initial={content} />
    </div>
  );
}
