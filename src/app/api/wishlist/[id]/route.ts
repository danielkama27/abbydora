import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });

  try {
    const existing = await prisma.wishlist.findUnique({ where: { id: params.id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await prisma.wishlist.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Wishlist DELETE error:", err);
    return NextResponse.json({ error: err?.message || "Failed to remove item" }, { status: 500 });
  }
}
