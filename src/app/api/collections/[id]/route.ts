import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "collection";
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}

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
    const data = { ...body };
    if (body.name) {
      data.slug = await uniqueSlug(body.name, params.id);
    }
    const collection = await prisma.collection.update({ where: { id: params.id }, data });
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
