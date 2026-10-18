import { NextResponse } from "next/server";

import { persistNewsletterSubscription } from "@/lib/cms/persistence";
import { newsletterSchema } from "@/lib/utils/validators";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let payload: Record<string, unknown>;

  if (contentType.includes("application/json")) {
    payload = await request.json();
  } else {
    const formData = await request.formData();
    payload = Object.fromEntries(formData.entries());
  }

  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please enter a valid email address.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const persistence = await persistNewsletterSubscription(parsed.data).catch((error) => {
    console.error("Newsletter subscription persistence failed", error);
    return {
      configured: true,
      written: false,
      id: undefined,
    };
  });

  return NextResponse.json({
    success: true,
    message: persistence.written
      ? "Thanks for subscribing. You are now in the CMS subscription queue."
      : "Thanks for subscribing. We’ll keep you posted as new opportunities and stories go live.",
    persistence: persistence.written
      ? "firestore"
      : persistence.configured
        ? "failed"
        : "not-configured",
    id: persistence.id,
    data: parsed.data,
  });
}
