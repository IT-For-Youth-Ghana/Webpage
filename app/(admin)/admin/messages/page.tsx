import { Mail } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsContactMessages, type CmsContactMessage } from "@/lib/cms/contact-messages";
import type { AdminTableColumn } from "@/types/admin";

const columns: AdminTableColumn<CmsContactMessage>[] = [
  {
    key: "name",
    label: "From",
    render: (row) => (
      <div>
        <p className="font-bold text-slate-950">{row.name}</p>
        <p className="mt-1 text-sm text-slate-500">{row.email}</p>
      </div>
    ),
  },
  { key: "enquiryType", label: "Enquiry" },
  {
    key: "message",
    label: "Message",
    render: (row) => <p className="max-w-2xl text-sm leading-6 text-slate-600">{row.message}</p>,
  },
  { key: "createdAt", label: "Received" },
  {
    key: "status",
    label: "Status",
    render: (row) => <AdminStatusPill status={row.status} />,
  },
  {
    key: "actions",
    label: "",
    className: "text-right",
    render: (row) => (
      <a
        href={`/admin/messages/${row.id}`}
        className="text-sm font-semibold text-brand-deep hover:text-brand-ink"
      >
        Review
      </a>
    ),
  },
];

export default async function AdminMessagesPage() {
  const messages = await getCmsContactMessages();
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Contact CMS"
        title="Contact messages"
        description="Review website contact submissions and mark them as reviewed or archived."
        icon={<Mail className="h-6 w-6" />}
      />

      <AdminDataTable columns={columns} rows={messages} emptyMessage="No messages yet." />
    </div>
  );
}
