"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, isLoading, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id);
    } catch (err: any) {
      toast.error(err?.message || "Could not remove item.");
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId);
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err?.message || "Could not add to cart.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-stone-400">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-medium text-stone-900 mb-10">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 mb-6">Your wishlist is empty</p>
          <Link href="/shop">
            <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white">Explore Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const images = JSON.parse(item.product.images || "[]");
            const image = images[0] || "/placeholder.jpg";
            return (
              <div key={item.id} className="group">
                <div className="relative bg-stone-50 aspect-[3/4] overflow-hidden mb-3">
                  <Image src={image} alt={item.product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button onClick={() => handleRemove(item.id)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Link href={`/shop/${item.product.id}`} className="block">
                  <p className="text-sm text-stone-900 hover:underline">{item.product.name}</p>
                  <p className="text-sm text-stone-500 mt-1">{formatPrice(item.product.price)}</p>
                </Link>
                <Button size="sm" className="mt-3 rounded-none bg-stone-900 hover:bg-stone-800 text-white text-xs" onClick={() => handleAddToCart(item.product.id)}>
                  <ShoppingBag className="h-3 w-3 mr-1" /> Add to Cart
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
