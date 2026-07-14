import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-7xl font-serif font-medium text-stone-900">404</h1>
      <p className="text-stone-500 text-lg">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white">Return Home</Button>
      </Link>
    </div>
  );
}
