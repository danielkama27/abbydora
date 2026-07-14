import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(wishlist);
  } catch (err: any) {
    console.error("Wishlist GET error:", err);
    return NextResponse.json({ error: err?.message || "Failed to load wishlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId } = await request.json();
    if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
    if (existing) return NextResponse.json({ error: "Already in wishlist" }, { status: 400 });
    const item = await prisma.wishlist.create({ data: { userId: session.user.id, productId } });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    console.error("Wishlist POST error:", err);
    return NextResponse.json({ error: err?.message || "Failed to add to wishlist" }, { status: 500 });
  }
}
