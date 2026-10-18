import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsOrganisationService } from "@/lib/cms/organisations";
import type { OrganisationServicePage } from "@/types/content";

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;
  const payload = (await request.json().catch(() => null)) as OrganisationServicePage | null;
  if (!payload || typeof payload !== "object") return NextResponse.json({ message: "Invalid page content." }, { status: 400 });
  const result = await saveCmsOrganisationService(params.slug, payload);
  if (!result.configured) return NextResponse.json({ message: "Firebase Admin is not configured." }, { status: 503 });
  revalidatePath("/for-organisations");
  revalidatePath(`/for-organisations/${params.slug}`);
  return NextResponse.json({ success: true, message: "Organisation service updated." });
}
