import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getAdminSessionCookieName,
  verifyAdminSessionCookie,
} from "@/lib/firebase/auth";

export async function getCurrentAdminUser() {
  const sessionCookie = cookies().get(getAdminSessionCookieName())?.value;

  return verifyAdminSessionCookie(sessionCookie).catch((error) => {
    console.error("Admin session verification failed", error);
    return null;
  });
}

export async function requireAdminApiSession() {
  const user = await getCurrentAdminUser();

  if (user) {
    return null;
  }

  return NextResponse.json(
    {
      success: false,
      message: "Please sign in before managing CMS content.",
    },
    { status: 401 },
  );
}
