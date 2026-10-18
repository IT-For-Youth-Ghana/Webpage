import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import {
  isNewsPageSlug,
  newsPageLabels,
  newsPagePreviewPaths,
  saveCmsNewsPage,
} from "@/lib/cms/news-pages";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { newsPageSchema } from "@/lib/utils/validators";

type NewsPageRouteContext = {
  params: { slug: string };
};

export async function PUT(request: Request, { params }: NewsPageRouteContext) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  if (!isNewsPageSlug(params.slug)) {
    return NextResponse.json(
      {
        success: false,
        message: "This news page is not registered for CMS editing.",
      },
      { status: 404 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = newsPageSchema.safeParse(payload);

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

  const result = await saveCmsNewsPage(params.slug, parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: `Firebase Admin is not configured yet, so ${newsPageLabels[params.slug]} cannot be saved.`,
      },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("newsPage", params.slug)) {
    revalidatePath(path);
  }

  revalidatePath(newsPagePreviewPaths[params.slug]);

  return NextResponse.json({
    success: true,
    message: `${newsPageLabels[params.slug]} updated.`,
    id: result.id,
  });
}
