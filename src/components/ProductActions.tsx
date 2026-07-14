"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

interface ProductActionsProps {
  productId: string;
  stock: number;
}

export function ProductActions({ productId, stock }: ProductActionsProps) {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();
  const [addingCart, setAddingCart] = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);

  async function handleAddToCart() {
    if (!user) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }
    if (stock <= 0) {
      toast.error("This item is out of stock.");
      return;
    }
    setAddingCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      await refreshCart();
      toast.success("Added to cart!");
    } catch {
      toast.error("Could not add to cart. Please try again.");
    } finally {
      setAddingCart(false);
    }
  }

  async function handleAddToWishlist() {
    if (!user) {
      toast.error("Please sign in to add items to your wishlist.");
      return;
    }
    setAddingWishlist(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.status === 400) {
        toast.info("Already in your wishlist.");
        return;
      }
      if (!res.ok) throw new Error("Failed to add to wishlist");
      await refreshWishlist();
      toast.success("Added to wishlist!");
    } catch {
      toast.error("Could not add to wishlist. Please try again.");
    } finally {
      setAddingWishlist(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleAddToCart}
        disabled={addingCart}
        className="flex-1 bg-abby-black text-abby-off-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-abby-black-soft transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ShoppingBag className="w-4 h-4" />
        {addingCart ? "Adding..." : "Add to Cart"}
      </button>
      <button
        onClick={handleAddToWishlist}
        disabled={addingWishlist}
        className="border border-abby-black text-abby-black px-6 py-4 hover:bg-abby-black hover:text-abby-off-white transition-colors disabled:opacity-50"
      >
        <Heart className="w-5 h-5" />
      </button>
    </div>
  );
}
