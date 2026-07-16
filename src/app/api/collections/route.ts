import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(collections);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const collection = await prisma.collection.create({ data: body });
    return NextResponse.json(collection, { status: 201 });
  } catch (err: any) {
    console.error("Collection POST error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create collection" }, { status: 500 });
  }
}
