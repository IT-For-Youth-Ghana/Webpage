import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { deleteCmsPartnershipTrack, saveCmsPartnershipTrack } from "@/lib/cms/partnerships";
import { partnershipTrackSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

type RouteProps = { params: { slug: string } };

export async function PUT(request: Request, { params }: RouteProps) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json().catch(() => null);
  const parsed = partnershipTrackSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the highlighted fields and try again.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await saveCmsPartnershipTrack(params.slug, parsed.data);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet, so the track cannot be saved." },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("partnership", params.slug)) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, message: "Partner track updated.", id: params.slug });
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const result = await deleteCmsPartnershipTrack(params.slug);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet, so the track cannot be deleted." },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("partnership", params.slug)) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, message: "Partner track deleted.", id: params.slug });
}
