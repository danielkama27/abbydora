"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  FileText,
  Tag,
  AlertTriangle,
  LogOut,
  Menu,
  X,
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
      { icon: FileText, label: "About Page", href: "/admin/marketing/about" },
      { icon: Tag, label: "Discount Codes", href: "/admin/marketing/discounts" },
      { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
      { icon: Mail, label: "Newsletter", href: "/admin/marketing/newsletter" },
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
  const [open, setOpen] = useState(false);

  // Auto-close the mobile drawer any time the page changes (i.e. the
  // moment someone taps a nav item like "Dashboard").
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Signed out.");
  };

  return (
    <>
      {/* Mobile top bar with hamburger — only visible below md */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-abby-black text-abby-off-white px-4 h-14">
        <span className="font-serif text-lg font-semibold">Admin Panel</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Dark overlay behind the drawer, tapping it also closes the menu */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          bg-abby-black text-abby-off-white flex flex-col overflow-y-auto
          fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-abby-black-soft flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold">Admin Panel</h2>
            <p className="text-xs text-abby-off-white/50 mt-1">AbbyDora Admin</p>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden text-abby-off-white/70">
            <X className="w-5 h-5" />
          </button>
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
    </>
  );
}
