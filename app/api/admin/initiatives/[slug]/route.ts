import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import { getCmsInitiativeBySlug, saveCmsInitiative } from "@/lib/cms/initiatives";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { initiativeSchema } from "@/lib/utils/validators";

type InitiativeRouteProps = {
  params: { slug: string };
};

function revalidateInitiativeRoutes(...slugs: Array<string | undefined>) {
  const paths = new Set(getRevalidationPaths("initiative"));

  for (const slug of slugs) {
    if (!slug) continue;

    for (const path of getRevalidationPaths("initiative", slug)) {
      paths.add(path);
    }
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request, { params }: InitiativeRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = initiativeSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the initiative JSON and try again.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  if (parsed.data.slug !== params.slug) {
    return NextResponse.json(
      {
        success: false,
        message:
          "The initiative slug must stay the same. Update navigation first if this route needs to change.",
      },
      { status: 400 },
    );
  }

  const existing = await getCmsInitiativeBySlug(params.slug);

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Initiative not found." },
      { status: 404 },
    );
  }

  const result = await saveCmsInitiative(parsed.data, params.slug);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the initiative cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateInitiativeRoutes(existing.slug, parsed.data.slug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "initiatives",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated initiative ${parsed.data.title}`,
    changes: { previousSlug: existing.slug, slug: parsed.data.slug },
  });

  return NextResponse.json({ success: true, message: "Initiative saved.", id: result.id });
}
