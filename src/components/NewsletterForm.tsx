"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not subscribe");
      toast.success("You're subscribed! Thanks for joining.");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.message || "Could not subscribe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 h-12 px-4 bg-white border border-abby-stone rounded-none text-sm focus:outline-none focus:border-abby-black"
      />
      <Button type="submit" disabled={loading} className="rounded-none bg-abby-black hover:bg-abby-black-soft text-abby-off-white h-12 px-6">
        {loading ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}
