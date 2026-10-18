import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import {
  deleteCmsArticle,
  getCmsArticleById,
  saveCmsArticle,
} from "@/lib/cms/articles";
import { articleSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { writeAuditLog } from "@/lib/cms/audit";

type ArticleRouteProps = {
  params: {
    id: string;
  };
};

function revalidateArticleRoutes(slug?: string) {
  for (const path of getRevalidationPaths("article", slug)) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request, { params }: ArticleRouteProps) {
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

  const existingArticle = await getCmsArticleById(params.id);
  const documentId = existingArticle?.id ?? params.id;
  const result = await saveCmsArticle(parsed.data, documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the article cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateArticleRoutes(existingArticle?.slug);
  revalidateArticleRoutes(parsed.data.slug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "articles",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated article ${parsed.data.slug}`,
    changes: { category: parsed.data.category, status: parsed.data.status },
  });
  return NextResponse.json({
    success: true,
    message: "Article updated.",
    id: result.id,
  });
}

export async function DELETE(_request: Request, { params }: ArticleRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const existingArticle = await getCmsArticleById(params.id);
  const documentId = existingArticle?.id ?? params.id;
  const result = await deleteCmsArticle(documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the article cannot be deleted.",
      },
      { status: 503 },
    );
  }

  revalidateArticleRoutes(existingArticle?.slug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "delete",
    resourceType: "articles",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Deleted article ${existingArticle?.slug ?? params.id}`,
  });
  return NextResponse.json({
    success: true,
    message: "Article deleted.",
    id: result.id,
  });
}
