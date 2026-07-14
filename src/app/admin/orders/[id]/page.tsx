"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

const statusOptions = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderDetail() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [params.id]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/orders/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrder({ ...order, status });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-abby-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-abby-black/50">Order not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-abby-gold hover:text-abby-black mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-abby-black">
          Order <span className="font-mono text-lg text-abby-gold">{order.id.slice(0, 12)}</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-abby-black/50">Status:</span>
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="px-3 py-2 text-sm font-semibold border border-abby-stone rounded-sm bg-white"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-sm border border-abby-stone">
          <div className="p-6 border-b border-abby-stone">
            <h2 className="font-serif text-lg font-semibold text-abby-black">Order Items</h2>
          </div>
          <div className="p-6 space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-abby-stone rounded-sm overflow-hidden flex-shrink-0">
                  {item.product?.image && (
                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/product/${item.product?.id}`} className="text-sm font-semibold text-abby-black hover:text-abby-gold transition-colors">
                    {item.product?.name}
                  </Link>
                  <p className="text-xs text-abby-black/50">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                </div>
                <div className="text-sm font-semibold text-abby-black">${(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-abby-stone bg-abby-cream">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-abby-black">Total</span>
              <span className="text-xl font-serif font-bold text-abby-black">${order.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-sm border border-abby-stone p-6">
            <h2 className="font-serif text-lg font-semibold text-abby-black mb-4">Customer</h2>
            <div className="space-y-2">
              <p className="text-sm text-abby-black"><span className="font-semibold">Name:</span> {order.user?.name || "—"}</p>
              <p className="text-sm text-abby-black"><span className="font-semibold">Email:</span> {order.user?.email}</p>
              <p className="text-sm text-abby-black"><span className="font-semibold">Joined:</span> {new Date(order.user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-sm border border-abby-stone p-6">
            <h2 className="font-serif text-lg font-semibold text-abby-black mb-4">Order Details</h2>
            <div className="space-y-2">
              <p className="text-sm text-abby-black"><span className="font-semibold">Order ID:</span> {order.id}</p>
              <p className="text-sm text-abby-black"><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-sm text-abby-black"><span className="font-semibold">Status:</span>
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-sm ${
                  order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                  order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                  order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>{order.status}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
