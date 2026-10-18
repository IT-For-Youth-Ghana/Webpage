import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsArticle } from "@/lib/cms/articles";
import { articleSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { writeAuditLog } from "@/lib/cms/audit";

function revalidateArticleRoutes(slug: string) {
  for (const path of getRevalidationPaths("article", slug)) {
    revalidatePath(path);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = articleSchema.safeParse(payload);

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

  const result = await saveCmsArticle(parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the article cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateArticleRoutes(parsed.data.slug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "create",
    resourceType: "articles",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Created article ${parsed.data.slug}`,
    changes: { category: parsed.data.category, status: parsed.data.status },
  });
  return NextResponse.json({
    success: true,
    message: "Article saved.",
    id: result.id,
  });
}
