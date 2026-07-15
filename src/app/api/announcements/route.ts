import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const announcements = await prisma.announcement.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (err: any) {
    console.error("Announcements GET error:", err);
    return NextResponse.json([]);
  }
}
