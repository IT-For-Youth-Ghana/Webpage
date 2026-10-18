import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = (await request.json().catch(() => null)) as {
    paths?: string[];
    contentType?: string;
    slug?: string;
  } | null;

  const paths =
    payload?.paths ??
    (payload?.contentType ? getRevalidationPaths(payload.contentType, payload.slug) : []);

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, revalidated: paths });
}
