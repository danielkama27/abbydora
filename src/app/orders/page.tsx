const orders = [
  { id: "#ORD-001", date: "Jan 15, 2024", items: 3, total: "$245.00", status: "Delivered" },
  { id: "#ORD-002", date: "Jan 10, 2024", items: 2, total: "$128.00", status: "Shipped" },
  { id: "#ORD-003", date: "Jan 05, 2024", items: 1, total: "$89.00", status: "Processing" },
];

export default function OrdersPage() {
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
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-stone-50 last:border-0">
                  <td className="py-4 pl-6 text-stone-900 font-medium">{o.id}</td>
                  <td className="py-4 text-stone-500">{o.date}</td>
                  <td className="py-4">{o.items}</td>
                  <td className="py-4 text-stone-900">{o.total}</td>
                  <td className="py-4 pr-6">
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
