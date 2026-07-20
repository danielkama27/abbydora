"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

function parseFirstImage(images: string): string {
  try {
    const arr = JSON.parse(images || "[]");
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : "/placeholder.jpg";
  } catch {
    return "/placeholder.jpg";
  }
}

export default function OrderPage() {
  const { items, subtotal, isLoading, refreshCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [shippingRate, setShippingRate] = useState(15);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200);
  const [paymentMethod] = useState<"mpesa">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; discountAmount: number } | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [awaitingMpesa, setAwaitingMpesa] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", country: "", postalCode: "", phone: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.shippingRate !== undefined) setShippingRate(data.shippingRate);
        if (data.freeShippingThreshold !== undefined) setFreeShippingThreshold(data.freeShippingThreshold);
      })
      .catch(() => {});
  }, []);

  // While waiting on an M-Pesa payment, poll the order every few seconds to
  // see whether the customer has completed (or cancelled) the prompt on
  // their phone yet.
  useEffect(() => {
    if (!awaitingMpesa || !placedOrderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${placedOrderId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.paymentStatus === "paid") {
          setPaymentStatus("paid");
          setAwaitingMpesa(false);
          setPlaced(true);
        } else if (data.paymentStatus === "failed") {
          setPaymentStatus("failed");
          setAwaitingMpesa(false);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [awaitingMpesa, placedOrderId]);

  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate;
  const discountAmount = appliedDiscount?.discountAmount || 0;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  async function handleApplyDiscount() {
    if (!discountCodeInput.trim()) return;
    setApplyingDiscount(true);
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCodeInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setAppliedDiscount({ code: data.code, discountAmount: data.discountAmount });
      toast.success(`Code ${data.code} applied!`);
    } catch (err: any) {
      toast.error(err?.message || "Invalid code");
    } finally {
      setApplyingDiscount(false);
    }
  }

  const requiredFieldsFilled =
    form.email.trim() && form.firstName.trim() && form.lastName.trim() &&
    form.address.trim() && form.city.trim() && form.country.trim();

  async function handlePlaceOrder() {
    if (!requiredFieldsFilled) {
      toast.error("Please fill in your contact and shipping details first.");
      return;
    }
    if (paymentMethod === "mpesa" && !mpesaPhone.trim()) {
      toast.error("Please enter the M-Pesa phone number to pay from.");
      return;
    }

    setPlacing(true);
    try {
      const payload = {
        shippingAddress: `${form.address}, ${form.city}, ${form.country} ${form.postalCode}${form.phone ? ` — Phone: ${form.phone}` : ""}`,
        paymentMethod,
        mpesaPhone: paymentMethod === "mpesa" ? mpesaPhone : undefined,
        discountCode: appliedDiscount?.code,
      };
      let res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 405) {
        // Some hosting setups occasionally block one HTTP method — retry with PUT as a fallback.
        res = await fetch("/api/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      if (data.mpesaError) {
        toast.error(data.mpesaError);
      }

      const order = data.order || data;
      await refreshCart();

      if (paymentMethod === "mpesa" && !data.mpesaError) {
        setPlacedOrderId(order.id);
        setAwaitingMpesa(true);
        toast.success("Check your phone to complete the M-Pesa payment.");
      } else {
        setPlaced(true);
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  // Wait for the cart to actually finish loading before deciding what to show —
  // deciding this too early was causing the page to briefly (and sometimes
  // permanently, on a slow connection) render the wrong state.
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-abby-black/40" />
      </div>
    );
  }

  if (awaitingMpesa) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-abby-cream min-h-screen flex flex-col justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-abby-black/40 mx-auto mb-6" />
        <h1 className="font-serif text-2xl font-medium text-abby-black mb-2">Check Your Phone</h1>
        <p className="text-abby-black/50 mb-2">
          An M-Pesa payment prompt was sent to <strong>{mpesaPhone}</strong>. Enter your M-Pesa PIN to complete the payment.
        </p>
        <p className="text-sm text-abby-black/40">This page will update automatically once payment is confirmed.</p>
        {paymentStatus === "failed" && (
          <p className="text-sm text-red-600 mt-4">
            The payment didn't go through (cancelled or timed out). Your order is saved — you can try paying again or contact us.
          </p>
        )}
      </div>
    );
  }

  if (placed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-abby-cream min-h-screen flex flex-col justify-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-abby-black mb-2">Order Placed</h1>
        <p className="text-abby-black/50 mb-8">Thank you for your order. You'll receive a confirmation shortly.</p>
        <Link href="/orders">
          <Button className="rounded-none bg-abby-black hover:bg-abby-black-soft text-white">View My Orders</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-abby-cream min-h-screen flex flex-col justify-center">
        <h1 className="font-serif text-2xl font-medium text-abby-black mb-2">Your cart is empty</h1>
        <Link href="/shop"><Button className="rounded-none mt-4">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-abby-cream min-h-screen">
      <Link href="/cart" className="text-sm text-abby-black/40 hover:text-abby-black flex items-center gap-1 mb-8">
        <ArrowLeft className="h-3 w-3" /> Back to cart
      </Link>

      <h1 className="font-serif text-3xl font-medium text-abby-black mb-8">Place Your Order</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="border border-abby-stone p-6">
            <h2 className="font-medium text-abby-black mb-4">Contact Information</h2>
            <div>
              <Label className="text-xs text-abby-black/50">Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-none mt-1"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="border border-abby-stone p-6">
            <h2 className="font-medium text-abby-black mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-abby-black/50">First Name *</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="rounded-none mt-1" required />
              </div>
              <div>
                <Label className="text-xs text-abby-black/50">Last Name *</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="rounded-none mt-1" required />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-abby-black/50">Address *</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-none mt-1" required />
              </div>
              <div>
                <Label className="text-xs text-abby-black/50">City *</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-none mt-1" required />
              </div>
              <div>
                <Label className="text-xs text-abby-black/50">Postal Code</Label>
                <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="rounded-none mt-1" />
              </div>
              <div>
                <Label className="text-xs text-abby-black/50">Country *</Label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="rounded-none mt-1" required />
              </div>
              <div>
                <Label className="text-xs text-abby-black/50">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-none mt-1" />
              </div>
            </div>
          </div>

          <div className="border border-abby-stone p-6">
            <h2 className="font-medium text-abby-black mb-4">Payment — M-Pesa</h2>
            <div>
              <Label className="text-xs text-abby-black/50">M-Pesa Phone Number *</Label>
              <Input
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="07XX XXX XXX"
                className="rounded-none mt-1 max-w-xs"
              />
              <p className="text-xs text-abby-black/40 mt-1">You'll get a payment prompt on this number to enter your PIN.</p>
            </div>
          </div>

          <Button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing}
            className="rounded-none h-12 bg-abby-black hover:bg-abby-black-soft text-white w-full sm:w-auto px-12"
          >
            {placing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Placing Order...
              </span>
            ) : (
              `Place Order — ${formatPrice(total)}`
            )}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="border border-abby-stone p-6">
            <h2 className="font-medium text-abby-black mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-16 bg-abby-stone rounded-sm overflow-hidden flex-shrink-0">
                    <img src={parseFirstImage(item.product.images)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-abby-black">{item.product.name}</p>
                    <p className="text-xs text-abby-black/40">
                      Qty: {item.quantity}
                      {(item as any).size && ` · ${(item as any).size}`}
                      {(item as any).color && ` · ${(item as any).color}`}
                    </p>
                  </div>
                  <span className="text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-abby-stone pt-4 pb-1">
              {appliedDiscount ? (
                <div className="flex items-center justify-between text-sm bg-green-50 text-green-700 px-3 py-2 rounded-sm">
                  <span>Code <strong>{appliedDiscount.code}</strong> applied</span>
                  <button onClick={() => { setAppliedDiscount(null); setDiscountCodeInput(""); }} className="text-xs underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={discountCodeInput}
                    onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                    placeholder="Discount code"
                    className="rounded-none flex-1"
                  />
                  <Button type="button" variant="outline" className="rounded-none" onClick={handleApplyDiscount} disabled={applyingDiscount}>
                    {applyingDiscount ? "..." : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            <div className="border-t border-abby-stone pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-abby-black/50"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-abby-black/50"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              {appliedDiscount && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discountAmount)}</span></div>
              )}
              <div className="flex justify-between font-medium text-abby-black text-base pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
