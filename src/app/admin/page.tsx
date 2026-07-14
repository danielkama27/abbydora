"use client";

import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Revenue", value: "KSh 24,530", icon: DollarSign, change: "+12%" },
    { label: "Total Orders", value: "1,284", icon: ShoppingBag, change: "+5%" },
    { label: "Total Customers", value: "3,420", icon: Users, change: "+8%" },
    { label: "Conversion", value: "3.2%", icon: TrendingUp, change: "+0.4%" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium text-stone-900">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-stone-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <s.icon className="h-5 w-5 text-stone-400" />
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5">{s.change}</span>
            </div>
            <p className="text-2xl font-medium text-stone-900">{s.value}</p>
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
              {[
                { id: "#ORD-001", customer: "Alice M.", total: "KSh 245.00", status: "Delivered" },
                { id: "#ORD-002", customer: "John D.", total: "KSh 128.00", status: "Shipped" },
                { id: "#ORD-003", customer: "Sarah K.", total: "KSh 89.00", status: "Processing" },
                { id: "#ORD-004", customer: "Mike R.", total: "KSh 356.00", status: "Delivered" },
              ].map((o, i) => (
                <tr key={i} className="border-b border-stone-50 last:border-0">
                  <td className="py-3">{o.id}</td>
                  <td className="py-3">{o.customer}</td>
                  <td className="py-3">{o.total}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${o.status === "Delivered" ? "bg-green-50 text-green-600" : o.status === "Shipped" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>{o.status}</span>
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
