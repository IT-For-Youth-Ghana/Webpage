import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsSitePage } from "@/lib/cms/site-pages";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { sitePageSchema } from "@/lib/utils/validators";

const PAGE_SLUG = "who-we-are";

export async function PUT(request: Request) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = sitePageSchema.safeParse(payload);

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

  const result = await saveCmsSitePage(PAGE_SLUG, parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the Who We Are page cannot be saved.",
      },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("sitePage", PAGE_SLUG)) {
    revalidatePath(path);
  }

  return NextResponse.json({
    success: true,
    message: "Who We Are page updated.",
    id: result.id,
  });
}
