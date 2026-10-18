import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { getCmsApplications } from "@/lib/cms/applications";

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const applications = await getCmsApplications();
  return NextResponse.json({ success: true, applications });
}
