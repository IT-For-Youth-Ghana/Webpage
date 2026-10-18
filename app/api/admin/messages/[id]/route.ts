import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { deleteCmsContactMessage, getCmsContactMessageById, updateCmsContactMessage } from "@/lib/cms/contact-messages";
import { contactMessageAdminUpdateSchema } from "@/lib/utils/validators";
import { getCurrentAdminUser } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const message = await getCmsContactMessageById(params.id);
  if (!message) return NextResponse.json({ success: false, message: "Message not found." }, { status: 404 });
  return NextResponse.json({ success: true, message });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json().catch(() => null);
  const parsed = contactMessageAdminUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the highlighted fields and try again.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await updateCmsContactMessage(params.id, parsed.data);
  if (!result.configured) return NextResponse.json({ success: false, message: "Firebase Admin is not configured yet." }, { status: 503 });
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "messages",
    resourceId: params.id,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated message status to ${parsed.data.status}`,
    changes: parsed.data,
  });
  return NextResponse.json({ success: true, message: "Message updated." });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const result = await deleteCmsContactMessage(params.id);
  if (!result.configured) return NextResponse.json({ success: false, message: "Firebase Admin is not configured yet." }, { status: 503 });
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "delete",
    resourceType: "messages",
    resourceId: params.id,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: "Deleted message",
  });
  return NextResponse.json({ success: true, message: "Message deleted." });
}
