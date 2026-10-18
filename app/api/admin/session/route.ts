import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createAdminSessionCookie,
  getAdminSessionCookieName,
  getAdminSessionMaxAgeMs,
} from "@/lib/firebase/auth";
import { getCurrentAdminUser } from "@/lib/cms/admin-auth";

const sessionSchema = z.object({
  idToken: z.string().min(20),
});

export async function GET() {
  const user = await getCurrentAdminUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "No active admin session.",
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = sessionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "A valid Firebase ID token is required.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const result = await createAdminSessionCookie(parsed.data.idToken).catch((error) => {
    console.error("Admin session creation failed", error);
    return {
      configured: true,
      user: null,
      sessionCookie: null,
    };
  });

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin credentials are not configured on the server.",
      },
      { status: 503 },
    );
  }

  if (!result.user || !result.sessionCookie) {
    return NextResponse.json(
      {
        success: false,
        message: "This Firebase user is not authorized for the CMS.",
      },
      { status: 403 },
    );
  }

  cookies().set(getAdminSessionCookieName(), result.sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(getAdminSessionMaxAgeMs() / 1000),
  });

  return NextResponse.json({
    success: true,
    message: "Admin session created.",
    user: result.user,
  });
}

export async function DELETE() {
  cookies().set(getAdminSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({
    success: true,
    message: "Admin session cleared.",
  });
}
