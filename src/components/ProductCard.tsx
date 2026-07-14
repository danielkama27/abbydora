"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";
import { useWishlist } from "@/lib/wishlist-context";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    images: string;
    featured: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { items, addItem, removeItem, isWishlisted } = useWishlist();
  const liked = isWishlisted(product.id);
  const images = JSON.parse(product.images || "[]");
  const firstImage = images[0] || "/placeholder.jpg";
  const [loading, setLoading] = useState(false);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to add items to your wishlist.");
      return;
    }
    setLoading(true);
    try {
      if (liked) {
        const wlItem = items.find((i) => i.productId === product.id);
        if (wlItem) await removeItem(wlItem.id);
        toast.success("Removed from wishlist.");
      } else {
        await addItem(product.id);
        toast.success("Added to wishlist!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative bg-abby-stone rounded-sm overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-abby-gold text-abby-black text-xs font-semibold px-3 py-1 uppercase tracking-wider">
              Featured
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            disabled={loading}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white disabled:opacity-50"
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-abby-black"}`}
            />
          </button>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-abby-black/0 group-hover:bg-abby-black/10 transition-colors duration-300" />
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-abby-black/40 uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="font-serif text-lg font-medium text-abby-black mb-2 group-hover:text-abby-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-abby-black">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
