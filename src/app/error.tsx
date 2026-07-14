"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-2xl font-serif font-medium text-stone-900">Something went wrong</h2>
      <p className="text-stone-500 text-center max-w-md">{error.message}</p>
      <Button onClick={reset} variant="outline" className="rounded-none mt-2">Try again</Button>
    </div>
  );
}
