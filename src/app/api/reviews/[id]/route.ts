import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  try {
    const review = await prisma.review.findUnique({ where: { id: params.id } });
    if (!review) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isOwner = review.userId === session.user.id;
    const isAdmin = (session.user as any).role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.review.delete({ where: { id: params.id } });

    const remaining = await prisma.review.findMany({ where: { productId: review.productId } });
    const avg = remaining.length > 0 ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length : null;
    await prisma.product.update({ where: { id: review.productId }, data: { averageRating: avg } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Review DELETE error:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete review" }, { status: 500 });
  }
}
