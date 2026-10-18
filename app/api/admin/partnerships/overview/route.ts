import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsPartnershipOverview } from "@/lib/cms/partnerships";
import { partnershipOverviewSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

export async function PUT(request: Request) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json().catch(() => null);
  const parsed = partnershipOverviewSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the highlighted fields and try again.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await saveCmsPartnershipOverview(parsed.data);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet, so the overview cannot be saved." },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("partnership")) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, message: "Overview updated." });
}
