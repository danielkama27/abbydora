"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-abby-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-abby-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-abby-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-abby-gold/30 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-abby-off-white mb-2">Access Denied</h2>
          <p className="text-abby-off-white/50">You must be an admin to access this area.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
