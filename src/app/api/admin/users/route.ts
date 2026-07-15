import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lastActiveAt: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}
