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

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, content, bannerImage, published } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    const announcement = await prisma.announcement.create({
      data: { title, content, bannerImage: bannerImage || null, published: Boolean(published) },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (err: any) {
    console.error("Announcement POST error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create announcement" }, { status: 500 });
  }
}
