"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Wishlist, Product } from "@prisma/client";

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

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshWishlist = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/wishlist");
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const addItem = useCallback(async (productId: string) => {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    await refreshWishlist();
  }, [refreshWishlist]);

  const removeItem = useCallback(async (id: string) => {
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
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
