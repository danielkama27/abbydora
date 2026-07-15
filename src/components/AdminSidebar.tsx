"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Star,
  ShoppingCart,
  Mail,
  Megaphone,
  Settings,
  LogOut,
} from "lucide-react";

import { signOut } from "next-auth/react";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShoppingBag, label: "Products", href: "/admin/products" },
  { icon: Users, label: "Customers", href: "/admin/users" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Mail, label: "Messages", href: "/admin/messages" },
  { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Signed out.");
  };

  return (
    <aside className="w-64 bg-abby-black text-abby-off-white flex flex-col">
      <div className="p-6 border-b border-abby-black-soft">
        <h2 className="font-serif text-xl font-semibold">Admin Panel</h2>
        <p className="text-xs text-abby-off-white/50 mt-1">AbbyDora Admin</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-abby-gold/10 text-abby-gold"
                      : "text-abby-off-white/70 hover:bg-abby-black-soft hover:text-abby-off-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-abby-black-soft">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-abby-off-white/70 hover:text-abby-off-white transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
