import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import {
  deleteCmsWhoWeAreDynamicPage,
  getCmsWhoWeAreDynamicPageBySlug,
  isReservedWhoWeAreSlug,
  saveCmsWhoWeAreDynamicPage,
} from "@/lib/cms/site-pages";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { dynamicSitePageSchema } from "@/lib/utils/validators";

type WhoWeAreDynamicPageRouteProps = {
  params: { slug: string };
};

export async function PUT(request: Request, { params }: WhoWeAreDynamicPageRouteProps) {
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

  if (isReservedWhoWeAreSlug(parsed.data.slug)) {
    return NextResponse.json(
      {
        success: false,
        message: "That slug is reserved for an existing Who We Are page.",
      },
      { status: 400 },
    );
  }

  const existing = await getCmsWhoWeAreDynamicPageBySlug(params.slug, true);

  if (!existing) {
    return NextResponse.json(
      {
        success: false,
        message: "That page could not be found.",
      },
      { status: 404 },
    );
  }

  const result = await saveCmsWhoWeAreDynamicPage(parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the page cannot be saved.",
      },
      { status: 503 },
    );
  }

  if (params.slug !== parsed.data.slug) {
    await deleteCmsWhoWeAreDynamicPage(params.slug);
  }

  for (const slug of new Set([params.slug, parsed.data.slug])) {
    for (const path of getRevalidationPaths("whoWeAreDynamicPage", slug)) {
      revalidatePath(path);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Who We Are page updated.",
    id: result.id,
  });
}
