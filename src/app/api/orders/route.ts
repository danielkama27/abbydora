import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { items, ...orderData } = body;
  const order = await prisma.order.create({
    data: {
      ...orderData,
      items: { createMany: { data: items } },
    },
    include: { items: { include: { product: true } } },
  });
  await prisma.cartItem.deleteMany({});
  return NextResponse.json(order, { status: 201 });
}
