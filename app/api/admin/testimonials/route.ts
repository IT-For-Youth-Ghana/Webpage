import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsTestimonial } from "@/lib/cms/testimonials";
import { testimonialSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { writeAuditLog } from "@/lib/cms/audit";

function revalidateTestimonialRoutes() {
  for (const path of getRevalidationPaths("testimonials")) {
    revalidatePath(path);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = testimonialSchema.safeParse(payload);

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

  const result = await saveCmsTestimonial(parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the testimonial cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateTestimonialRoutes();
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "create",
    resourceType: "testimonials",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Created testimonial ${parsed.data.name}`,
  });
  return NextResponse.json({ success: true, message: "Testimonial saved.", id: result.id });
}
