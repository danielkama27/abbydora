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
    const body = await request.json();
    const collection = await prisma.collection.update({ where: { id: params.id }, data: body });
    return NextResponse.json(collection);
  } catch (err: any) {
    console.error("Collection PUT error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.collection.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Collection DELETE error:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete collection" }, { status: 500 });
  }
}
