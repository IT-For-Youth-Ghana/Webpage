import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import {
  deleteCmsDepartment,
  getCmsDepartmentById,
  saveCmsDepartment,
} from "@/lib/cms/departments";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { departmentSchema } from "@/lib/utils/validators";

type DepartmentRouteProps = {
  params: { id: string };
};

function revalidateDepartmentRoutes(slug?: string) {
  for (const path of getRevalidationPaths("department", slug)) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request, { params }: DepartmentRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = departmentSchema.safeParse(payload);

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

  const existing = await getCmsDepartmentById(params.id);
  const documentId = existing?.id ?? params.id;
  const result = await saveCmsDepartment(parsed.data, documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the department cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateDepartmentRoutes(existing?.slug);
  revalidateDepartmentRoutes(parsed.data.slug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "departments",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated department ${parsed.data.title}`,
    changes: { status: parsed.data.status, slug: parsed.data.slug },
  });

  return NextResponse.json({ success: true, message: "Department updated.", id: result.id });
}

export async function DELETE(_request: Request, { params }: DepartmentRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const existing = await getCmsDepartmentById(params.id);
  const documentId = existing?.id ?? params.id;
  const result = await deleteCmsDepartment(documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the department cannot be deleted.",
      },
      { status: 503 },
    );
  }

  revalidateDepartmentRoutes(existing?.slug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "delete",
    resourceType: "departments",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Deleted department ${existing?.title ?? params.id}`,
  });

  return NextResponse.json({ success: true, message: "Department deleted.", id: result.id });
}
