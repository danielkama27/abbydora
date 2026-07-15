import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    await prisma.user.update({
      where: { id },
      data: { lastActiveAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Stale session referencing a deleted user — fail quietly, not the user's problem.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
