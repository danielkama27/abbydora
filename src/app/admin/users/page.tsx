"use client";

import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  lastActiveAt: string | null;
  createdAt: string;
  _count: { orders: number; reviews: number };
}

const ONLINE_WINDOW_MS = 2 * 60 * 1000; // considered "online" if active in last 2 minutes

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000); // refresh every 30s for a live feel
    return () => clearInterval(interval);
  }, []);

  const isOnline = (u: AdminUser) =>
    u.lastActiveAt && Date.now() - new Date(u.lastActiveAt).getTime() < ONLINE_WINDOW_MS;

  const onlineCount = users.filter(isOnline).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium text-stone-900">Customers</h1>
        <span className="text-sm text-stone-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {onlineCount} online now
        </span>
      </div>
      <div className="bg-white border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-400 border-b border-stone-100">
                <th className="pb-3 pl-6 font-normal">Status</th>
                <th className="pb-3 font-normal">Name</th>
                <th className="pb-3 font-normal">Email</th>
                <th className="pb-3 font-normal">Role</th>
                <th className="pb-3 font-normal">Orders</th>
                <th className="pb-3 font-normal">Last Active</th>
                <th className="pb-3 pr-6 font-normal">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="py-8 text-center text-stone-400">Loading...</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-stone-400">No customers yet.</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="border-b border-stone-50 last:border-0">
                  <td className="py-3 pl-6">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${isOnline(u) ? "bg-green-500" : "bg-stone-300"}`}
                      title={isOnline(u) ? "Online" : "Offline"}
                    />
                  </td>
                  <td className="py-3 text-stone-900">{u.name || "—"}</td>
                  <td className="py-3 text-stone-500">{u.email}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${u.role === "admin" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">{u._count.orders}</td>
                  <td className="py-3 text-stone-400">{timeAgo(u.lastActiveAt)}</td>
                  <td className="py-3 pr-6 text-stone-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
