import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { deleteCmsTeamMember, getCmsTeamMemberById, saveCmsTeamMember } from "@/lib/cms/team";
import { teamSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { writeAuditLog } from "@/lib/cms/audit";

type TeamRouteProps = {
  params: { id: string };
};

function revalidateTeamRoutes(...departmentSlugs: Array<string | undefined>) {
  const paths = new Set(getRevalidationPaths("team"));

  for (const slug of departmentSlugs) {
    if (!slug) continue;

    for (const path of getRevalidationPaths("department", slug)) {
      paths.add(path);
    }
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request, { params }: TeamRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = teamSchema.safeParse(payload);

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

  const existing = await getCmsTeamMemberById(params.id);
  const documentId = existing?.id ?? params.id;
  const result = await saveCmsTeamMember(parsed.data, documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Firebase Admin is not configured yet, so the team member cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateTeamRoutes(existing?.departmentSlug, parsed.data.departmentSlug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "team",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated team member ${parsed.data.name}`,
    changes: { status: parsed.data.status, department: parsed.data.department },
  });
  return NextResponse.json({ success: true, message: "Team member updated.", id: result.id });
}

export async function DELETE(_request: Request, { params }: TeamRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const existing = await getCmsTeamMemberById(params.id);
  const documentId = existing?.id ?? params.id;
  const result = await deleteCmsTeamMember(documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Firebase Admin is not configured yet, so the team member cannot be deleted.",
      },
      { status: 503 },
    );
  }

  revalidateTeamRoutes(existing?.departmentSlug);
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "delete",
    resourceType: "team",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Deleted team member ${existing?.name ?? params.id}`,
  });
  return NextResponse.json({ success: true, message: "Team member deleted.", id: result.id });
}
