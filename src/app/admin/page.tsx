"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StatsData {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
    onlineOrders?: number;
    posOrders?: number;
  };
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    channel?: string;
    guestName?: string | null;
    user: { name: string | null; email: string | null } | null;
  }>;
}

const statusStyle: Record<string, string> = {
  DELIVERED: "bg-green-50 text-green-600",
  SHIPPED: "bg-blue-50 text-blue-600",
  PROCESSING: "bg-amber-50 text-amber-600",
  PENDING: "bg-amber-50 text-amber-600",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch("/api/admin/stats")
        .then((r) => r.json())
        .then(setData)
        .finally(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, 30_000); // keep the dashboard live without a manual refresh
    return () => clearInterval(interval);
  }, []);

  const conversion =
    data && data.stats.totalUsers > 0
      ? ((data.stats.totalOrders / data.stats.totalUsers) * 100).toFixed(1) + "%"
      : "—";

  const stats = [
    { label: "Total Revenue", value: data ? formatPrice(data.stats.totalRevenue) : "—", icon: DollarSign },
    { label: "Total Orders", value: data ? data.stats.totalOrders.toLocaleString() : "—", icon: ShoppingBag },
    { label: "Total Customers", value: data ? data.stats.totalUsers.toLocaleString() : "—", icon: Users },
    {
      label: "Online vs In-Store",
      value: data ? `${data.stats.onlineOrders ?? 0} / ${data.stats.posOrders ?? 0}` : "—",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium text-stone-900">Dashboard</h1>
        <span className="text-sm text-stone-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-stone-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <s.icon className="h-5 w-5 text-stone-400" />
            </div>
            <p className="text-2xl font-medium text-stone-900">{loading ? "..." : s.value}</p>
            <p className="text-sm text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-100 p-6">
        <h2 className="font-medium text-stone-900 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-400 border-b border-stone-100">
                <th className="pb-3 font-normal">Order ID</th>
                <th className="pb-3 font-normal">Customer</th>
                <th className="pb-3 font-normal">Total</th>
                <th className="pb-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="text-stone-600">
              {loading && (
                <tr><td colSpan={4} className="py-6 text-center text-stone-400">Loading...</td></tr>
              )}
              {!loading && (!data || data.recentOrders.length === 0) && (
                <tr><td colSpan={4} className="py-6 text-center text-stone-400">No orders yet.</td></tr>
              )}
              {data?.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-stone-50 last:border-0">
                  <td className="py-3">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3">
                    {o.user?.name || o.user?.email || o.guestName || (o.channel === "pos" ? "Walk-in (POS)" : "—")}
                  </td>
                  <td className="py-3">{formatPrice(o.total)}</td>
                  <td className="py-3">
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
