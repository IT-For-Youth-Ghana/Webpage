import { Mail } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getCmsContactMessageById } from "@/lib/cms/contact-messages";
import { MessageForm } from "@/components/admin/message-form";

export default async function AdminMessageEditPage({ params }: { params: { id: string } }) {
  const message = await getCmsContactMessageById(params.id);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Contact CMS"
        title={message ? `Message from ${message.name}` : "Review message"}
        description="Update status or add internal notes."
        icon={<Mail className="h-6 w-6" />}
      />

      {message ? (
        <MessageForm message={{ id: message.id, name: message.name, email: message.email, enquiryType: message.enquiryType, message: message.message, status: message.status }} />
      ) : (
        <p className="rounded-[28px] border border-brand-border bg-white p-6 text-slate-600">This message could not be found.</p>
      )}
    </div>
  );
}
