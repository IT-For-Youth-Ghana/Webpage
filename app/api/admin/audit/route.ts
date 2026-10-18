import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { getAuditLogs } from "@/lib/cms/audit";

export async function GET(request: Request) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.max(1, Math.min(500, Number(limitParam) || 100)) : 100;

  const entries = await getAuditLogs(limit);
  return NextResponse.json({ success: true, entries });
}
