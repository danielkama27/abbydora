import { Resend } from "resend";

// Requires RESEND_API_KEY in environment variables.
// Get one free at https://resend.com (no card required, 100 emails/day free).
// Without a verified custom domain, emails send from Resend's shared
// "onboarding@resend.dev" address — fine for getting started.

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email sending is not configured yet — missing RESEND_API_KEY.");
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL || "AbbyDora <onboarding@resend.dev>";

  await resend.emails.send({
    from: fromAddress,
    to,
    subject: "Reset your AbbyDora password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0a0a0a;">Reset your password</h2>
        <p style="color: #444;">We received a request to reset the password for your AbbyDora account. Click the button below to choose a new one. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #0a0a0a; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
        <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
      </div>
    `,
  });
}
