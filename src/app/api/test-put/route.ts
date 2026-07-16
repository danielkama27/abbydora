import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, method: "GET" });
}

export async function PUT() {
  return NextResponse.json({ ok: true, method: "PUT" });
}

export async function POST() {
  return NextResponse.json({ ok: true, method: "POST" });
}
