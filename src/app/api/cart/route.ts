import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return NextResponse.json({ items: cartItems, subtotal });
  } catch (err: any) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ error: err?.message || "Failed to load cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId, quantity } = await request.json();
    if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 1) },
      });
      return NextResponse.json(updated, { status: 200 });
    }
    const item = await prisma.cartItem.create({ data: { userId: session.user.id, productId, quantity: quantity || 1 } });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: err?.message || "Failed to add to cart" }, { status: 500 });
  }
}
