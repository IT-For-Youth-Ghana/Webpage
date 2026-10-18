import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { deleteCmsJob, getCmsJobById, saveCmsJob } from "@/lib/cms/jobs";
import { jobSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

type JobRouteProps = {
  params: {
    id: string;
  };
};

function revalidateJobRoutes() {
  for (const path of getRevalidationPaths("job")) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request, { params }: JobRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = jobSchema.safeParse(payload);

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

  const existingJob = await getCmsJobById(params.id);
  const documentId = existingJob?.id ?? params.id;
  const result = await saveCmsJob(parsed.data, documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the job listing cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateJobRoutes();

  return NextResponse.json({
    success: true,
    message: "Job listing updated.",
    id: result.id,
  });
}

export async function DELETE(_request: Request, { params }: JobRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const existingJob = await getCmsJobById(params.id);
  const documentId = existingJob?.id ?? params.id;
  const result = await deleteCmsJob(documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the job listing cannot be deleted.",
      },
      { status: 503 },
    );
  }

  revalidateJobRoutes();

  return NextResponse.json({
    success: true,
    message: "Job listing deleted.",
    id: result.id,
  });
}
