import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminAuth } from "@/lib/firebase/admin";
import { resolveFileServerUser } from "@/lib/firebase/auth";

const fileServerSessionSchema = z.object({
  idToken: z.string().min(20),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = fileServerSessionSchema.safeParse(payload);

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

  const auth = await getAdminAuth();

  if (!auth) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin credentials are not configured on the server.",
      },
      { status: 503 },
    );
  }

  const user = await auth
    .verifyIdToken(parsed.data.idToken, true)
    .then(resolveFileServerUser)
    .catch((error) => {
      console.error("File server token verification failed", error);
      return null;
    });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "This Firebase user is not authorized for the file server.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}
