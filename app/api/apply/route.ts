import { NextResponse } from "next/server";

import { persistApplication } from "@/lib/cms/persistence";
import { applicationSchema } from "@/lib/utils/validators";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const parsed = applicationSchema.safeParse(payload);

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

  const persistence = await persistApplication(parsed.data).catch((error) => {
    console.error("Application persistence failed", error);
    return {
      configured: true,
      written: false,
      id: undefined,
    };
  });

  return NextResponse.json({
    success: true,
    message: persistence.written
      ? "Application received. The ITFY team can now review it in the CMS."
      : "Application validated locally. Firestore persistence will activate when Firebase Admin credentials are configured.",
    persistence: persistence.written
      ? "firestore"
      : persistence.configured
        ? "failed"
        : "not-configured",
    id: persistence.id,
    data: parsed.data,
  });
}
