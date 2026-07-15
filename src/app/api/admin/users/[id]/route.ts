import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await request.json();
    if (!["admin", "customer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(user);
  } catch (err: any) {
    console.error("Admin user PUT error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update user" }, { status: 500 });
  }
}
