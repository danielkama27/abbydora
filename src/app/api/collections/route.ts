import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(collections);
}

export async function POST(request: Request) {
  const body = await request.json();
  const collection = await prisma.collection.create({ data: body });
  return NextResponse.json(collection, { status: 201 });
}
