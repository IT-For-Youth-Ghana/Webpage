import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import {
  isReservedWhatWeDoSlug,
  saveCmsWhatWeDoDynamicPage,
} from "@/lib/cms/site-pages";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { dynamicSitePageSchema } from "@/lib/utils/validators";

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = dynamicSitePageSchema.safeParse(payload);

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

  if (isReservedWhatWeDoSlug(parsed.data.slug)) {
    return NextResponse.json(
      {
        success: false,
        message: "That slug is reserved for an existing initiative page.",
      },
      { status: 400 },
    );
  }

  const result = await saveCmsWhatWeDoDynamicPage(parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the page cannot be saved.",
      },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("whatWeDoDynamicPage", parsed.data.slug)) {
    revalidatePath(path);
  }

  return NextResponse.json({
    success: true,
    message: "What We Do page created.",
    id: result.id,
  });
}
