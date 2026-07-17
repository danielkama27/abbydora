import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") return null;
  return session;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { active } = await request.json();
    const discount = await prisma.discount.update({ where: { id: params.id }, data: { active } });
    return NextResponse.json(discount);
  } catch (err: any) {
    console.error("Discount PUT error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update discount" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.discount.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Discount DELETE error:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete discount" }, { status: 500 });
  }
}
