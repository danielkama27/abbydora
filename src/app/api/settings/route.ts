import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getOrCreateSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "singleton" } });
  }
  return settings;
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json(settings);
  } catch (err: any) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ error: err?.message || "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // TEMPORARY: testing whether the auth() check is what breaks this route.
  const session = await auth();
  return NextResponse.json({ ok: true, debug: "auth check passed", hasSession: !!session });
}

export async function POST(request: Request) {
  return NextResponse.json({ ok: true, debug: "minimal POST reached" });
}
