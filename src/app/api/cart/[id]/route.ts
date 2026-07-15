import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });

  try {
    const { quantity } = await request.json();
    const existing = await prisma.cartItem.findUnique({ where: { id: params.id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const item = await prisma.cartItem.update({ where: { id: params.id }, data: { quantity } });
    return NextResponse.json(item);
  } catch (err: any) {
    console.error("Cart PUT error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });

  try {
    const existing = await prisma.cartItem.findUnique({ where: { id: params.id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await prisma.cartItem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cart DELETE error:", err);
    return NextResponse.json({ error: err?.message || "Failed to remove item" }, { status: 500 });
  }
}
