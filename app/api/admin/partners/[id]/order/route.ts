import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

type RouteProps = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteProps) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as { order?: number } | null;
  const nextOrder = typeof body?.order === "number" && Number.isFinite(body.order) ? body.order : null;
  if (nextOrder === null) {
    return NextResponse.json({ success: false, message: "Invalid order value." }, { status: 400 });
  }

  const db = await getAdminFirestore();
  if (!db) {
    return NextResponse.json({ success: false, message: "Firebase Admin is not configured yet." }, { status: 503 });
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.partners).doc(params.id).set(
    { order: nextOrder, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );

  for (const path of getRevalidationPaths("partners")) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, message: "Order updated." });
}
