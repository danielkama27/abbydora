"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingBag, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string;
  sizes: string;
}

interface SaleLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  maxQty: number;
}

function firstImage(images: string): string {
  try {
    const arr = JSON.parse(images || "[]");
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : "";
  } catch {
    return "";
  }
}

function parseSizeStock(sizes: string): Record<string, number> {
  try {
    const obj = JSON.parse(sizes || "{}");
    return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
  } catch {
    return {};
  }
}

export default function AdminPosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sale, setSale] = useState<SaleLine[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mpesa">("cash");
  const [completing, setCompleting] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  useEffect(() => {
    fetch("/api/products?limit=200")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  function addToSale(product: Product, size?: string) {
    const sizeStock = parseSizeStock(product.sizes);
    const maxQty = size ? (sizeStock[size] ?? 0) : product.stock;
    if (maxQty <= 0) {
      toast.error("Out of stock.");
      return;
    }
    setSale((prev) => {
      const existing = prev.find((l) => l.productId === product.id && l.size === size);
      if (existing) {
        if (existing.quantity >= maxQty) {
          toast.error("No more stock available for this item.");
          return prev;
        }
        return prev.map((l) => (l === existing ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1, size, maxQty }];
    });
  }

  function changeQty(index: number, delta: number) {
    setSale((prev) => {
      const copy = [...prev];
      const line = copy[index];
      const newQty = line.quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
        return copy;
      }
      if (newQty > line.maxQty) {
        toast.error("No more stock available for this item.");
        return prev;
      }
      copy[index] = { ...line, quantity: newQty };
      return copy;
    });
  }

  function removeLine(index: number) {
    setSale((prev) => prev.filter((_, i) => i !== index));
  }

  const total = sale.reduce((sum, l) => sum + l.price * l.quantity, 0);

  async function completeSale() {
    if (sale.length === 0) {
      toast.error("Add at least one item to the sale.");
      return;
    }
    setCompleting(true);
    try {
      const res = await fetch("/api/admin/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: sale.map((l) => ({ productId: l.productId, quantity: l.quantity, size: l.size })),
          guestName: guestName || undefined,
          guestPhone: guestPhone || undefined,
          paymentMethod,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to complete sale");

      setLastReceipt(data);
      setSale([]);
      setGuestName("");
      setGuestPhone("");
      toast.success("Sale completed!");

      // Refresh stock numbers so the product grid reflects the new totals.
      fetch("/api/products?limit=200").then((r) => r.json()).then((d) => setProducts(d.products || []));
    } catch (err: any) {
      toast.error(err?.message || "Could not complete sale");
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Product picker */}
      <div className="lg:col-span-2 flex flex-col min-h-0">
        <h1 className="font-serif text-2xl font-medium text-stone-900 mb-4">Point of Sale</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-900"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1 content-start">
          {filtered.map((p) => {
            const sizeStock = parseSizeStock(p.sizes);
            const sizeOptions = Object.keys(sizeStock);
            return (
              <div key={p.id} className="border border-stone-100 bg-white p-3">
                <div className="aspect-square bg-stone-100 mb-2 overflow-hidden rounded-sm">
                  {firstImage(p.images) && <img src={firstImage(p.images)} alt="" className="w-full h-full object-cover" />}
                </div>
                <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                <p className="text-sm text-stone-500 mb-2">{formatPrice(p.price)}</p>
                {sizeOptions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {sizeOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => addToSale(p, s)}
                        disabled={(sizeStock[s] ?? 0) <= 0}
                        className="text-xs px-2 py-1 border border-stone-200 rounded-sm hover:border-stone-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => addToSale(p)}
                    disabled={p.stock <= 0}
                    className="w-full text-xs py-1.5 bg-stone-900 text-white rounded-sm hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {p.stock <= 0 ? "Out of stock" : "Add"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current sale */}
      <div className="bg-white border border-stone-100 flex flex-col min-h-0">
        <div className="p-4 border-b border-stone-100">
          <h2 className="font-medium text-stone-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> Current Sale
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sale.length === 0 && <p className="text-sm text-stone-400 text-center py-8">No items yet — click a product to add it.</p>}
          {sale.map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-900 truncate">{line.name}{line.size && ` (${line.size})`}</p>
                <p className="text-xs text-stone-400">{formatPrice(line.price)} each</p>
              </div>
              <button onClick={() => changeQty(i, -1)} className="p-1 border border-stone-200 rounded-sm"><Minus className="h-3 w-3" /></button>
              <span className="text-sm w-5 text-center">{line.quantity}</span>
              <button onClick={() => changeQty(i, 1)} className="p-1 border border-stone-200 rounded-sm"><Plus className="h-3 w-3" /></button>
              <button onClick={() => removeLine(i)} className="text-stone-300 hover:text-red-500 ml-1"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-stone-100 space-y-3">
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Customer name (optional)"
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-sm focus:outline-none focus:border-stone-900"
          />
          <input
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-sm focus:outline-none focus:border-stone-900"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`flex-1 text-xs py-2 rounded-sm border ${paymentMethod === "cash" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600"}`}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod("mpesa")}
              className={`flex-1 text-xs py-2 rounded-sm border ${paymentMethod === "mpesa" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600"}`}
            >
              M-Pesa
            </button>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-stone-100">
            <span className="text-sm text-stone-500">Total</span>
            <span className="text-xl font-medium text-stone-900">{formatPrice(total)}</span>
          </div>
          <button
            onClick={completeSale}
            disabled={completing || sale.length === 0}
            className="w-full py-3 bg-stone-900 text-white text-sm font-medium rounded-sm hover:bg-stone-800 disabled:opacity-50"
          >
            {completing ? "Completing..." : "Complete Sale"}
          </button>
        </div>
      </div>

      {lastReceipt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setLastReceipt(null)}>
          <div className="bg-white p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <p className="font-medium text-stone-900 mb-1">Sale Complete</p>
            <p className="text-2xl font-medium text-stone-900 mb-4">{formatPrice(lastReceipt.total)}</p>
            <p className="text-xs text-stone-400 mb-4">Order #{lastReceipt.id?.slice(0, 8).toUpperCase()}</p>
            <button onClick={() => setLastReceipt(null)} className="w-full py-2.5 bg-stone-900 text-white text-sm rounded-sm">
              New Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
