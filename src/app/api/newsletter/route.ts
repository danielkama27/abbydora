import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "You're already subscribed!" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.create({ data: { email: email.trim().toLowerCase() } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 500 });
  }
}
