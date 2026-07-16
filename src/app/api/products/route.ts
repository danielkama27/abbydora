import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const collectionId = searchParams.get("collectionId");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "20");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (category) where.category = category;
  if (collectionId) where.collectionId = collectionId;
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { collection: true, reviews: { include: { user: { select: { id: true, name: true, image: true } } } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, pages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const product = await prisma.product.create({ data: body });
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("Product POST error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create product" }, { status: 500 });
  }
}
