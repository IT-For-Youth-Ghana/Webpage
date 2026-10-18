import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import {
  getCmsSitePageLabel,
  isCmsSitePageSlug,
  saveCmsSitePage,
} from "@/lib/cms/site-pages";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { sitePageSchema } from "@/lib/utils/validators";

type SiteContentRouteContext = {
  params: { slug: string };
};

export async function PUT(request: Request, { params }: SiteContentRouteContext) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const pageSlug = params.slug;

  if (!isCmsSitePageSlug(pageSlug)) {
    return NextResponse.json(
      {
        success: false,
        message: "This site page is not registered for CMS editing.",
      },
      { status: 404 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = sitePageSchema.safeParse(payload);
  const pageLabel = getCmsSitePageLabel(pageSlug);

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

  const result = await saveCmsSitePage(pageSlug, parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: `Firebase Admin is not configured yet, so the ${pageLabel} page cannot be saved.`,
      },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("sitePage", pageSlug)) {
    revalidatePath(path);
  }

  return NextResponse.json({
    success: true,
    message: `${pageLabel} page updated.`,
    id: result.id,
  });
}
