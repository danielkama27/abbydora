import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const review = await prisma.review.create({ data: body });
  const reviews = await prisma.review.findMany({ where: { productId: body.productId } });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await prisma.product.update({ where: { id: body.productId }, data: { averageRating: avg } });
  return NextResponse.json(review, { status: 201 });
}
