"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, subtotal, refreshCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
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
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", country: "", postalCode: "", phone: "",
  });

  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: `${form.address}, ${form.city}, ${form.country} ${form.postalCode}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to place order");
      }
      await refreshCart();
      setPlaced(true);
    } catch (err: any) {
      toast.error(err?.message || "Could not place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-stone-900 mb-2">Order Confirmed</h1>
        <p className="text-stone-500 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
        <Link href="/orders">
          <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white">View Orders</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-medium text-stone-900 mb-2">Your cart is empty</h1>
        <Link href="/shop"><Button className="rounded-none mt-4">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/cart" className="text-sm text-stone-400 hover:text-stone-900 flex items-center gap-1 mb-8">
        <ArrowLeft className="h-3 w-3" /> Back to cart
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <div className="border border-stone-100 p-6">
            <h2 className="font-medium text-stone-900 mb-4">Contact Information</h2>
            <div className="grid gap-4">
              <div>
                <Label className="text-xs text-stone-500">Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-none mt-1" placeholder="you@example.com" />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="border border-stone-100 p-6">
            <h2 className="font-medium text-stone-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-stone-500">First Name</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="rounded-none mt-1" />
              </div>
              <div>
                <Label className="text-xs text-stone-500">Last Name</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="rounded-none mt-1" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-stone-500">Address</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-none mt-1" />
              </div>
              <div>
                <Label className="text-xs text-stone-500">City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-none mt-1" />
              </div>
              <div>
                <Label className="text-xs text-stone-500">Postal Code</Label>
                <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="rounded-none mt-1" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-stone-500">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-none mt-1" />
              </div>
            </div>
          </div>

          <Button onClick={handlePlaceOrder} disabled={placing} className="rounded-none h-12 bg-stone-900 hover:bg-stone-800 text-white w-full sm:w-auto px-12">
            {placing ? "Placing Order..." : `Place Order — ${formatPrice(total)}`}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="border border-stone-100 p-6">
            <h2 className="font-medium text-stone-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-16 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900">{item.product.name}</p>
                    <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-stone-500"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-medium text-stone-900 text-base pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
