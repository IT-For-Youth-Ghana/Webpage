import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  getRevalidationPaths,
  isValidRevalidationSecret,
} from "@/lib/utils/revalidate";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    paths?: string[];
    contentType?: string;
    slug?: string;
    secret?: string;
  };

  if (!isValidRevalidationSecret(payload.secret)) {
    return NextResponse.json({ success: false, message: "Invalid secret." }, { status: 401 });
  }

  const paths = payload.paths ?? (
    payload.contentType ? getRevalidationPaths(payload.contentType, payload.slug) : []
  );

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, revalidated: paths });
}
