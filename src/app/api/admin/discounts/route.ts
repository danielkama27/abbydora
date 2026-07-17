import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const discounts = await prisma.discount.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(discounts);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { code, type, value, expiresAt, usageLimit } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json({ error: "Code, type, and value are required" }, { status: 400 });
    }
    if (!["percentage", "fixed"].includes(type)) {
      return NextResponse.json({ error: "Type must be 'percentage' or 'fixed'" }, { status: 400 });
    }

    const discount = await prisma.discount.create({
      data: {
        code: code.trim().toUpperCase(),
        type,
        value: parseFloat(value),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
      },
    });
    return NextResponse.json(discount, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "That code already exists" }, { status: 400 });
    }
    console.error("Discount POST error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create discount" }, { status: 500 });
  }
}
