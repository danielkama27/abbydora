"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { id: string }[];
}

const statusStyle: Record<string, string> = {
  DELIVERED: "bg-green-50 text-green-600",
  SHIPPED: "bg-blue-50 text-blue-600",
  PROCESSING: "bg-amber-50 text-amber-600",
  PENDING: "bg-amber-50 text-amber-600",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-medium text-stone-900 mb-10">My Orders</h1>

      <div className="border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-400 border-b border-stone-100">
                <th className="pb-3 pl-6 font-normal">Order ID</th>
                <th className="pb-3 font-normal">Date</th>
                <th className="pb-3 font-normal">Items</th>
                <th className="pb-3 font-normal">Total</th>
                <th className="pb-3 pr-6 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="py-8 text-center text-stone-400">Loading...</td></tr>
              )}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-stone-400">No orders yet.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-stone-50 last:border-0">
                  <td className="py-4 pl-6 text-stone-900 font-medium">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-4 text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-4">{o.items.length}</td>
                  <td className="py-4 text-stone-900">{formatPrice(o.total)}</td>
                  <td className="py-4 pr-6">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${statusStyle[o.status?.toUpperCase()] || "bg-stone-100 text-stone-600"}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
