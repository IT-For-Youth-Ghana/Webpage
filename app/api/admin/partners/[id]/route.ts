import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import {
  deleteCmsPartner,
  getCmsPartnerById,
  saveCmsPartner,
} from "@/lib/cms/partners";
import { partnerSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { writeAuditLog } from "@/lib/cms/audit";

type PartnerRouteProps = {
  params: {
    id: string;
  };
};

function revalidatePartnerRoutes() {
  for (const path of getRevalidationPaths("partners")) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request, { params }: PartnerRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = partnerSchema.safeParse(payload);

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

  const existingPartner = await getCmsPartnerById(params.id);
  const documentId = existingPartner?.id ?? params.id;
  const result = await saveCmsPartner(parsed.data, documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the partner cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidatePartnerRoutes();
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "partners",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated partner ${parsed.data.name}`,
  });
  return NextResponse.json({
    success: true,
    message: "Partner updated.",
    id: result.id,
  });
}

export async function DELETE(_request: Request, { params }: PartnerRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const existingPartner = await getCmsPartnerById(params.id);
  const documentId = existingPartner?.id ?? params.id;
  const result = await deleteCmsPartner(documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the partner cannot be deleted.",
      },
      { status: 503 },
    );
  }

  revalidatePartnerRoutes();
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "delete",
    resourceType: "partners",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Deleted partner ${existingPartner?.name ?? params.id}`,
  });
  return NextResponse.json({
    success: true,
    message: "Partner deleted.",
    id: result.id,
  });
}
