"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Wishlist, Product } from "@prisma/client";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

interface WishlistWithProduct extends Wishlist {
  product: Product;
}

interface WishlistContextType {
  items: WishlistWithProduct[];
  isLoading: boolean;
  addItem: (productId: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

async function handleExpiredSession(res: Response) {
  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));
    if (data.error === "SESSION_EXPIRED") {
      toast.error("Your session expired. Please sign in again.");
      await signOut({ redirect: true, callbackUrl: "/auth/signin" });
      return true;
    }
  }
  return false;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        if (await handleExpiredSession(res)) return;
        setItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const addItem = useCallback(async (productId: string) => {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) {
      if (await handleExpiredSession(res)) throw new Error("Session expired");
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to add to wishlist");
    }
    await refreshWishlist();
  }, [refreshWishlist]);

  const removeItem = useCallback(async (id: string) => {
    const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    if (!res.ok) {
      if (await handleExpiredSession(res)) throw new Error("Session expired");
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to remove from wishlist");
    }
    await refreshWishlist();
  }, [refreshWishlist]);

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, isLoading, addItem, removeItem, isWishlisted, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
