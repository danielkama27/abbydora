"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs tracking-[0.3em] uppercase text-stone-400 block mb-3">Get in Touch</span>
      <h1 className="font-serif text-4xl font-medium text-stone-900 mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-stone-500 leading-relaxed mb-6">We'd love to hear from you. Whether you have a question about our products, shipping, or anything else, our team is ready to help.</p>
          <div className="space-y-4 text-sm text-stone-500">
            <p><strong className="text-stone-900">Email:</strong> abbydoraclothing@gmail.com</p>
            <p><strong className="text-stone-900">Phone:</strong> +254 794 450644</p>
            <p><strong className="text-stone-900">Hours:</strong> Daily, 6:00 AM – 8:00 PM GMT</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs text-stone-500">Name</Label>
            <Input className="rounded-none mt-1" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label className="text-xs text-stone-500">Email</Label>
            <Input type="email" className="rounded-none mt-1" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label className="text-xs text-stone-500">Message</Label>
            <Textarea className="rounded-none mt-1 min-h-[120px]" placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
