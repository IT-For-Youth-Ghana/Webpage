import { NextResponse } from "next/server";

import { getCourseCatalog } from "@/lib/api/courses";

export async function GET() {
  const courses = await getCourseCatalog();
  return NextResponse.json({ success: true, data: courses });
}
