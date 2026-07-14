"use client";

import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster richColors position="top-right" />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
