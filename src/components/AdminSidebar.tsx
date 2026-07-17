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
  Layers,
  Store,
  Image as ImageIcon,
  Tag,
  AlertTriangle,
  LogOut,
} from "lucide-react";

import { signOut } from "next-auth/react";
import { toast } from "sonner";

const navGroups = [
  {
    label: null,
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      { icon: Store, label: "Point of Sale", href: "/admin/pos" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { icon: ShoppingBag, label: "Products", href: "/admin/products" },
      { icon: Layers, label: "Featured & Collections", href: "/admin/featured" },
    ],
  },
  {
    label: "Sales",
    items: [
      { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
      { icon: Users, label: "Customers", href: "/admin/users" },
      { icon: Star, label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { icon: ImageIcon, label: "Homepage Hero", href: "/admin/marketing/hero" },
      { icon: Tag, label: "Discount Codes", href: "/admin/marketing/discounts" },
      { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
    ],
  },
  {
    label: null,
    items: [
      { icon: Mail, label: "Messages", href: "/admin/messages" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
      { icon: AlertTriangle, label: "Danger Zone", href: "/admin/danger-zone" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Signed out.");
  };

  return (
    <aside className="w-64 bg-abby-black text-abby-off-white flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-abby-black-soft">
        <h2 className="font-serif text-xl font-semibold">Admin Panel</h2>
        <p className="text-xs text-abby-off-white/50 mt-1">AbbyDora Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-5">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-[10px] uppercase tracking-widest text-abby-off-white/30 px-3 mb-1.5">{group.label}</p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isDanger = item.href === "/admin/danger-zone";
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-abby-gold/10 text-abby-gold"
                          : isDanger
                          ? "text-red-400/70 hover:bg-abby-black-soft hover:text-red-400"
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
          </div>
        ))}
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
