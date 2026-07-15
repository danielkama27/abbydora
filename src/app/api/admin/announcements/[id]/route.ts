import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }
  return session;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content, bannerImage, published } = body;
    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(bannerImage !== undefined && { bannerImage: bannerImage || null }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });
    return NextResponse.json(announcement);
  } catch (err: any) {
    console.error("Announcement PUT error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update announcement" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.announcement.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Announcement DELETE error:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete announcement" }, { status: 500 });
  }
}
