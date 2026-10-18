import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import { createCmsUserWithAuth, getCmsUsers } from "@/lib/cms/users";
import { userSchema } from "@/lib/utils/validators";

function getCreateUserErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error &&
    "code" in error &&
    (error as { code?: unknown }).code === "auth/email-already-exists"
  ) {
    return "A Firebase Auth account already exists for this email address.";
  }

  return "We could not create this user right now.";
}

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const users = await getCmsUsers();
  return NextResponse.json({ success: true, users });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const current = await getCurrentAdminUser();
  if (current?.role !== "super-admin") {
    return NextResponse.json(
      { success: false, message: "Only super-admins can create users." },
      { status: 403 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = userSchema.safeParse(payload);

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

  const result = await createCmsUserWithAuth(parsed.data).catch((error) => {
    console.error("Admin user creation failed", error);
    return {
      configured: true,
      written: false,
      id: undefined,
      authCreated: false,
      emailConfigured: true,
      emailDelivered: false,
      emailError: getCreateUserErrorMessage(error),
    };
  });

  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  if (!result.emailConfigured) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Email delivery is not configured. Set EMAIL_PROVIDER, EMAIL_USER, EMAIL_PASSWORD, and EMAIL_FROM_ADDRESS before creating admin users.",
      },
      { status: 503 },
    );
  }

  if (!result.written || !result.authCreated) {
    return NextResponse.json(
      {
        success: false,
        message: result.emailError || "The Firebase Auth user could not be created.",
      },
      { status: 502 },
    );
  }

  if (!result.emailDelivered) {
    return NextResponse.json(
      {
        success: false,
        message:
          result.emailError ||
          "The Firebase Auth user was created, but the temporary password email could not be sent.",
      },
      { status: 502 },
    );
  }

  await writeAuditLog({
    action: "create",
    resourceType: "users",
    resourceId: String(result.id ?? parsed.data.email),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Created user ${parsed.data.email}`,
    changes: { role: parsed.data.role, status: parsed.data.status },
  });

  return NextResponse.json({
    success: true,
    message: "User created and temporary password email sent.",
    id: result.id,
  });
}
