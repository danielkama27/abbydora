"use client";

import { useState } from "react";
import { seedDatabase } from "@/lib/seed";
import { Button } from "@/components/ui/button";

export default function SeedPage() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await seedDatabase();
    setMessage(result.message);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="font-serif text-2xl font-medium text-stone-900 mb-4">Seed Database</h1>
      <p className="text-stone-500 mb-8">Initialize the database with sample products and data.</p>
      <form onSubmit={handleSubmit}>
        <Button type="submit" className="rounded-none bg-stone-900 hover:bg-stone-800 text-white">Seed Database</Button>
      </form>
      {message && <p className="mt-4 text-sm text-stone-500">{message}</p>}
    </div>
  );
}
