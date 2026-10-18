import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { getCmsContactMessages } from "@/lib/cms/contact-messages";

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const messages = await getCmsContactMessages();
  return NextResponse.json({ success: true, messages });
}
