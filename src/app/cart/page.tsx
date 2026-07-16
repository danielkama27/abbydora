"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const { items, subtotal, isLoading, updateItem, removeItem } = useCart();
  const [shippingRate, setShippingRate] = useState(15);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.shippingRate !== undefined) setShippingRate(data.shippingRate);
        if (data.freeShippingThreshold !== undefined) setFreeShippingThreshold(data.freeShippingThreshold);
      })
      .catch(() => {});
  }, []);

  const shipping = subtotal > freeShippingThreshold ? 0 : shippingRate;
  const total = subtotal + shipping;

  const handleUpdate = async (id: string, quantity: number) => {
    try {
      await updateItem(id, quantity);
    } catch (err: any) {
      toast.error(err?.message || "Could not update quantity.");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id);
      toast.success("Removed from cart.");
    } catch (err: any) {
      toast.error(err?.message || "Could not remove item.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-stone-400">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-medium text-stone-900 mb-10">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 mb-6">Your cart is empty</p>
          <Link href="/shop">
            <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const images = JSON.parse(item.product.images || "[]");
              const image = images[0] || "/placeholder.jpg";
              return (
                <div key={item.id} className="flex gap-6 border-b border-stone-100 pb-6">
                  <div className="w-24 h-28 bg-stone-50 overflow-hidden flex-shrink-0 relative">
                    <Image src={image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/shop/${item.product.id}`} className="font-medium text-stone-900 hover:underline">{item.product.name}</Link>
                        <p className="text-sm text-stone-400 mt-1">
                          {item.product.category}
                          {(item as any).size && ` · Size: ${(item as any).size}`}
                          {(item as any).color && ` · Color: ${(item as any).color}`}
                        </p>
                      </div>
                      <p className="font-medium text-stone-900">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-stone-200">
                        <button onClick={() => handleUpdate(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-stone-50"><Minus className="h-3 w-3" /></button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button onClick={() => handleUpdate(item.id, item.quantity + 1)} className="p-2 hover:bg-stone-50"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="text-stone-400 hover:text-red-600"><Trash className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border border-stone-100 p-6 h-fit">
            <h2 className="font-medium text-stone-900 mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-stone-500"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="border-t border-stone-100 pt-3 flex justify-between font-medium text-stone-900"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <Link href="/checkout">
              <Button className="rounded-none w-full h-12 bg-stone-900 hover:bg-stone-800 text-white">Place Order</Button>
            </Link>
            <p className="text-xs text-stone-400 mt-3 text-center">Free shipping on orders over {formatPrice(freeShippingThreshold)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
