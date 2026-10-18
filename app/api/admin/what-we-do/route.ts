import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import { saveCmsWhatWeDoOverview } from "@/lib/cms/initiatives";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { whatWeDoOverviewSchema } from "@/lib/utils/validators";

function revalidateWhatWeDoRoutes() {
  for (const path of getRevalidationPaths("initiative")) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = whatWeDoOverviewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the overview JSON and try again.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const result = await saveCmsWhatWeDoOverview(parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the What We Do overview cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateWhatWeDoRoutes();
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "what-we-do",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: "Updated What We Do overview",
    changes: { slug: "what-we-do" },
  });

  return NextResponse.json({ success: true, message: "What We Do overview saved.", id: result.id });
}
