import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = order.userId === session.user.id;
    const isAdmin = (session.user as any).role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err: any) {
    console.error("Order GET error:", err);
    return NextResponse.json({ error: err?.message || "Failed to load order" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const order = await prisma.order.update({ where: { id: params.id }, data: { status } });
    return NextResponse.json(order);
  } catch (err: any) {
    console.error("Order PUT error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update order" }, { status: 500 });
  }
}
