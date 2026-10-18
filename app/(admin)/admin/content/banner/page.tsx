import { Megaphone } from "lucide-react";

import { AnnouncementForm } from "@/components/admin/announcement-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getCmsAnnouncement } from "@/lib/cms/homepage";

export default async function AdminBannerPage() {
  const announcement = await getCmsAnnouncement();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage CMS"
        title="Announcement banner"
        description="Manage cohort windows, campaign messages, urgent notes, and the top-of-site CTA."
        icon={<Megaphone className="h-5 w-5" />}
      />

      <AnnouncementForm initial={announcement} />
    </div>
  );
}
