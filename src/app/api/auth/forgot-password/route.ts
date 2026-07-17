import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Enter your email address" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Always respond with success even if no account exists — this prevents
    // letting someone probe which emails have accounts on the site.
    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email: normalizedEmail, token, expiresAt },
    });

    const appUrl = process.env.AUTH_URL || "";
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    await sendPasswordResetEmail(normalizedEmail, resetUrl);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: err?.message || "Could not send reset email" }, { status: 500 });
  }
}
