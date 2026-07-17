"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSent(true);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <Link href="/auth/signin" className="text-sm text-stone-400 hover:text-stone-900 flex items-center gap-1 mb-8">
        <ArrowLeft className="h-3 w-3" /> Back to sign in
      </Link>

      {sent ? (
        <div className="text-center">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-medium text-stone-900 mb-2">Check Your Email</h1>
          <p className="text-stone-500 text-sm">
            If an account exists for <strong>{email}</strong>, we've sent a link to reset your password. It expires in 1 hour.
          </p>
        </div>
      ) : (
        <>
          <h1 className="font-serif text-2xl font-medium text-stone-900 mb-2">Forgot Password</h1>
          <p className="text-stone-500 text-sm mb-6">Enter your email and we'll send you a link to reset it.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-none"
              required
            />
            <Button type="submit" disabled={loading} className="w-full rounded-none bg-stone-900 hover:bg-stone-800 text-white">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
