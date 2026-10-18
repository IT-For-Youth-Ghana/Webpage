import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import { saveCmsDepartment } from "@/lib/cms/departments";
import { departmentSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

function revalidateDepartmentRoutes(slug?: string) {
  for (const path of getRevalidationPaths("department", slug)) {
    revalidatePath(path);
  }
}

export async function POST(request: Request) {
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

  const result = await saveCmsDepartment(parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the department cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateDepartmentRoutes(parsed.data.slug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "create",
    resourceType: "departments",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Created department ${parsed.data.title}`,
    changes: { status: parsed.data.status, slug: parsed.data.slug },
  });

  return NextResponse.json({ success: true, message: "Department saved.", id: result.id });
}
