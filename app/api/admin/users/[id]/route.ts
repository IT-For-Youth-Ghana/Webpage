import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { deleteCmsUser, getCmsUserById, saveCmsUser } from "@/lib/cms/users";
import { userSchema } from "@/lib/utils/validators";
import { writeAuditLog } from "@/lib/cms/audit";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const user = await getCmsUserById(params.id);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, user });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const current = await getCurrentAdminUser();
  if (current?.role !== "super-admin") {
    return NextResponse.json(
      { success: false, message: "Only super-admins can update users." },
      { status: 403 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = userSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields and try again.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const existing = await getCmsUserById(params.id);
  const id = existing?.id ?? params.id;
  const result = await saveCmsUser(parsed.data, id);

  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  await writeAuditLog({
    action: "update",
    resourceType: "users",
    resourceId: String(result.id ?? id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated user ${parsed.data.email}`,
    changes: { role: parsed.data.role, status: parsed.data.status },
  });

  return NextResponse.json({ success: true, message: "User updated.", id: result.id });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const current = await getCurrentAdminUser();
  if (current?.role !== "super-admin") {
    return NextResponse.json(
      { success: false, message: "Only super-admins can delete users." },
      { status: 403 },
    );
  }

  const existing = await getCmsUserById(params.id);
  const id = existing?.id ?? params.id;
  const result = await deleteCmsUser(id);

  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  await writeAuditLog({
    action: "delete",
    resourceType: "users",
    resourceId: String(result.id ?? id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Deleted user ${existing?.email ?? id}`,
  });

  return NextResponse.json({ success: true, message: "User deleted.", id: result.id });
}
