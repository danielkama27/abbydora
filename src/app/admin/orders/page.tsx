"use client";

const orders = [
  { id: "#ORD-001", customer: "Alice M.", email: "alice@example.com", items: 3, total: "$245.00", status: "Delivered", date: "2024-01-15" },
  { id: "#ORD-002", customer: "John D.", email: "john@example.com", items: 2, total: "$128.00", status: "Shipped", date: "2024-01-14" },
  { id: "#ORD-003", customer: "Sarah K.", email: "sarah@example.com", items: 1, total: "$89.00", status: "Processing", date: "2024-01-14" },
  { id: "#ORD-004", customer: "Mike R.", email: "mike@example.com", items: 4, total: "$356.00", status: "Delivered", date: "2024-01-12" },
  { id: "#ORD-005", customer: "Emma L.", email: "emma@example.com", items: 2, total: "$178.00", status: "Pending", date: "2024-01-11" },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium text-stone-900">Orders</h1>
      <div className="bg-white border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-400 border-b border-stone-100">
                <th className="pb-3 pl-6 font-normal">Order ID</th>
                <th className="pb-3 font-normal">Customer</th>
                <th className="pb-3 font-normal">Items</th>
                <th className="pb-3 font-normal">Total</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-stone-50 last:border-0">
                  <td className="py-3 pl-6 text-stone-900">{o.id}</td>
                  <td className="py-3">
                    <p className="text-stone-900">{o.customer}</p>
                    <p className="text-xs text-stone-400">{o.email}</p>
                  </td>
                  <td className="py-3">{o.items}</td>
                  <td className="py-3">{o.total}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${o.status === "Delivered" ? "bg-green-50 text-green-600" : o.status === "Shipped" ? "bg-blue-50 text-blue-600" : o.status === "Processing" ? "bg-amber-50 text-amber-600" : "bg-stone-100 text-stone-600"}`}>{o.status}</span>
                  </td>
                  <td className="py-3 text-stone-400">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
