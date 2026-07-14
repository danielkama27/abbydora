const users = [
  { name: "Alice M.", email: "alice@example.com", role: "Customer", orders: 12, joined: "2023-06-15" },
  { name: "John D.", email: "john@example.com", role: "Customer", orders: 8, joined: "2023-08-22" },
  { name: "Sarah K.", email: "sarah@example.com", role: "Customer", orders: 5, joined: "2023-11-03" },
  { name: "Mike R.", email: "mike@example.com", role: "Admin", orders: 0, joined: "2023-01-10" },
  { name: "Emma L.", email: "emma@example.com", role: "Customer", orders: 3, joined: "2024-01-05" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium text-stone-900">Users</h1>
      <div className="bg-white border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-400 border-b border-stone-100">
                <th className="pb-3 pl-6 font-normal">Name</th>
                <th className="pb-3 font-normal">Email</th>
                <th className="pb-3 font-normal">Role</th>
                <th className="pb-3 font-normal">Orders</th>
                <th className="pb-3 font-normal">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-stone-50 last:border-0">
                  <td className="py-3 pl-6 text-stone-900">{u.name}</td>
                  <td className="py-3 text-stone-500">{u.email}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${u.role === "Admin" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"}`}>{u.role}</span>
                  </td>
                  <td className="py-3">{u.orders}</td>
                  <td className="py-3 text-stone-400">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
