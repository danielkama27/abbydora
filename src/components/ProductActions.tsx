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
  sizes?: string; // JSON-stringified { "S": 5, "M": 10 }
  colors?: string; // JSON-stringified ["Black", "Cream"]
}

function parseSizeStock(sizes?: string): Record<string, number> {
  try {
    const obj = JSON.parse(sizes || "{}");
    return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
  } catch {
    return {};
  }
}

function parseColors(colors?: string): string[] {
  try {
    const arr = JSON.parse(colors || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function ProductActions({ productId, stock, sizes, colors }: ProductActionsProps) {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();
  const [addingCart, setAddingCart] = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);

  const sizeStock = parseSizeStock(sizes);
  const sizeOptions = Object.keys(sizeStock);
  const colorOptions = parseColors(colors);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  async function handleAddToCart() {
    if (!user) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }
    if (stock <= 0) {
      toast.error("This item is out of stock.");
      return;
    }
    if (sizeOptions.length > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if (colorOptions.length > 0 && !selectedColor) {
      toast.error("Please select a color.");
      return;
    }
    if (selectedSize && (sizeStock[selectedSize] ?? 0) <= 0) {
      toast.error("That size is out of stock.");
      return;
    }

    setAddingCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add to cart");
      }
      await refreshCart();
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err?.message || "Could not add to cart. Please try again.");
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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add to wishlist");
      }
      await refreshWishlist();
      toast.success("Added to wishlist!");
    } catch (err: any) {
      toast.error(err?.message || "Could not add to wishlist. Please try again.");
    } finally {
      setAddingWishlist(false);
    }
  }

  return (
    <div className="space-y-4">
      {sizeOptions.length > 0 && (
        <div>
          <p className="text-sm text-abby-black/70 mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => {
              const outOfStock = (sizeStock[s] ?? 0) <= 0;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedSize === s
                      ? "border-abby-black bg-abby-black text-abby-off-white"
                      : "border-abby-stone text-abby-black hover:border-abby-black"
                  } ${outOfStock ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colorOptions.length > 0 && (
        <div>
          <p className="text-sm text-abby-black/70 mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  selectedColor === c
                    ? "border-abby-black bg-abby-black text-abby-off-white"
                    : "border-abby-stone text-abby-black hover:border-abby-black"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
}
