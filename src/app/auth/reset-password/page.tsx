"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    if (!token) {
      toast.error("This reset link is missing its token — please use the link from your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not reset password");
      setDone(true);
      setTimeout(() => router.push("/auth/signin"), 2500);
    } catch (err: any) {
      toast.error(err?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="font-serif text-2xl font-medium text-stone-900 mb-2">Password Reset</h1>
        <p className="text-stone-500 text-sm">Taking you to sign in...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <h1 className="font-serif text-2xl font-medium text-stone-900 mb-2">Set a New Password</h1>
      {!token && (
        <p className="text-sm text-red-600 mb-4">
          No reset token found in this link. Please use the exact link from your email, or{" "}
          <Link href="/auth/forgot-password" className="underline">request a new one</Link>.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-stone-500">New Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-none mt-1"
            minLength={6}
            required
          />
        </div>
        <div>
          <label className="text-xs text-stone-500">Confirm New Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-none mt-1"
            minLength={6}
            required
          />
        </div>
        <Button type="submit" disabled={loading || !token} className="w-full rounded-none bg-stone-900 hover:bg-stone-800 text-white">
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
