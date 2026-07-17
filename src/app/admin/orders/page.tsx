"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface AdminOrder {
  id: string;
  total: number;
  status: string;
  channel: string;
  guestName: string | null;
  createdAt: string;
  items: { id: string }[];
  user: { name: string | null; email: string | null } | null;
}

const statusStyle: Record<string, string> = {
  DELIVERED: "bg-green-50 text-green-600",
  SHIPPED: "bg-blue-50 text-blue-600",
  PROCESSING: "bg-amber-50 text-amber-600",
  PENDING: "bg-amber-50 text-amber-600",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium text-stone-900">Orders</h1>
      <div className="bg-white border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-400 border-b border-stone-100">
                <th className="pb-3 pl-6 font-normal">Order ID</th>
                <th className="pb-3 font-normal">Channel</th>
                <th className="pb-3 font-normal">Customer</th>
                <th className="pb-3 font-normal">Items</th>
                <th className="pb-3 font-normal">Total</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 pr-6 font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="py-8 text-center text-stone-400">Loading...</td></tr>
              )}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-stone-400">No orders yet.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-stone-50 last:border-0">
                  <td className="py-3 pl-6 text-stone-900">
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${o.channel === "pos" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                      {o.channel === "pos" ? "In-Store" : "Online"}
                    </span>
                  </td>
                  <td className="py-3">
                    <p className="text-stone-900">{o.user?.name || o.guestName || "Walk-in customer"}</p>
                    <p className="text-xs text-stone-400">{o.user?.email}</p>
                  </td>
                  <td className="py-3">{o.items.length}</td>
                  <td className="py-3">{formatPrice(o.total)}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${statusStyle[o.status?.toUpperCase()] || "bg-stone-100 text-stone-600"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 pr-6 text-stone-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
