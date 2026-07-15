"use client";

import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { ThemeProvider } from "@/lib/theme-context";
import { Heartbeat } from "./Heartbeat";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Heartbeat />
            {children}
            <Toaster richColors position="top-right" />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
