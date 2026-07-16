"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CartItem, Product } from "@prisma/client";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

interface CartItemWithProduct extends CartItem {
  product: Product;
}

interface CartContextType {
  items: CartItemWithProduct[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

async function handleExpiredSession(res: Response) {
  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));
    if (data.error === "SESSION_EXPIRED") {
      toast.error("Your session expired. Please sign in again.");
      signOut({ redirect: false }).then(() => {
        window.location.href = "/auth/signin";
      });
      return true;
    }
  }
  return false;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setSubtotal(data.subtotal);
      } else {
        if (await handleExpiredSession(res)) return;
        setItems([]);
        setSubtotal(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (productId: string, quantity = 1, size?: string, color?: string) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, size, color }),
    });
    if (!res.ok) {
      if (await handleExpiredSession(res)) throw new Error("Session expired");
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to add to cart");
    }
    await refreshCart();
  }, [refreshCart]);

  const updateItem = useCallback(async (id: string, quantity: number) => {
    const res = await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      if (await handleExpiredSession(res)) throw new Error("Session expired");
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update cart");
    }
    await refreshCart();
  }, [refreshCart]);

  const removeItem = useCallback(async (id: string) => {
    const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
    if (!res.ok) {
      if (await handleExpiredSession(res)) throw new Error("Session expired");
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to remove item");
    }
    await refreshCart();
  }, [refreshCart]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, subtotal, itemCount, isLoading, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
