import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      collection: true,
      reviews: { include: { user: { select: { id: true, name: true, image: true } } } },
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const product = await prisma.product.update({ where: { id: params.id }, data: body });
    return NextResponse.json(product);
  } catch (err: any) {
    console.error("Product PUT error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Product DELETE error:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete product" }, { status: 500 });
  }
}
