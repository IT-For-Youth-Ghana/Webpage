import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsOrganisationOverview } from "@/lib/cms/organisations";
import type { OrganisationOverviewContent } from "@/types/content";

export async function PUT(request: Request) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;
  const payload = (await request.json().catch(() => null)) as OrganisationOverviewContent | null;
  if (!payload || typeof payload !== "object") return NextResponse.json({ message: "Invalid page content." }, { status: 400 });
  const result = await saveCmsOrganisationOverview(payload);
  if (!result.configured) return NextResponse.json({ message: "Firebase Admin is not configured." }, { status: 503 });
  revalidatePath("/for-organisations");
  return NextResponse.json({ success: true, message: "Organisations overview updated." });
}
