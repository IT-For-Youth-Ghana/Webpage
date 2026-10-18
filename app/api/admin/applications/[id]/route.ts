import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { deleteCmsApplication, getCmsApplicationById, updateCmsApplication } from "@/lib/cms/applications";
import { applicationAdminUpdateSchema } from "@/lib/utils/validators";
import { getCurrentAdminUser } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const application = await getCmsApplicationById(params.id);
  if (!application) {
    return NextResponse.json({ success: false, message: "Application not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, application });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json().catch(() => null);
  const parsed = applicationAdminUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the highlighted fields and try again.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const update = await updateCmsApplication(params.id, parsed.data);
  if (!update.configured) {
    return NextResponse.json({ success: false, message: "Firebase Admin is not configured yet." }, { status: 503 });
  }
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "applications",
    resourceId: params.id,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated application status to ${parsed.data.status}`,
    changes: parsed.data,
  });
  return NextResponse.json({ success: true, message: "Application updated." });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const result = await deleteCmsApplication(params.id);
  if (!result.configured) {
    return NextResponse.json({ success: false, message: "Firebase Admin is not configured yet." }, { status: 503 });
  }
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "delete",
    resourceType: "applications",
    resourceId: params.id,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: "Deleted application",
  });
  return NextResponse.json({ success: true, message: "Application deleted." });
}
