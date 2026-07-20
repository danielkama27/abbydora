import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (err: any) {
    console.error("Reviews GET error:", err);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  try {
    const { productId, rating, comment } = await request.json();

    if (!productId || rating === undefined) {
      return NextResponse.json({ error: "productId and rating are required" }, { status: 400 });
    }
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: "Rating must be a whole number from 1 to 5" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = await prisma.review.findFirst({
      where: { productId, userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json({ error: "You've already reviewed this product." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: { productId, rating: numericRating, comment: comment || null, userId: session.user.id },
      include: { user: { select: { name: true } } },
    });

    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.product.update({ where: { id: productId }, data: { averageRating: avg } });

    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    console.error("Reviews POST error:", err);
    return NextResponse.json({ error: err?.message || "Failed to submit review" }, { status: 500 });
  }
}
