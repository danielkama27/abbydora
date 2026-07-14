"use client";

import { useState } from "react";
import { Package, Heart, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const [active, setActive] = useState("profile");

  const menu = [
    { id: "profile", label: "Profile", icon: Settings },
    { id: "orders", label: "Orders", icon: Package, href: "/orders" },
    { id: "wishlist", label: "Wishlist", icon: Heart, href: "/wishlist" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-medium text-stone-900 mb-10">My Account</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {menu.map((m) => (
            m.href ? (
              <Link key={m.id} href={m.href}>
                <button className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-colors ${active === m.id ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-50"}`}>
                  <m.icon className="h-4 w-4" /> {m.label}
                </button>
              </Link>
            ) : (
              <button key={m.id} onClick={() => setActive(m.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-colors ${active === m.id ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-50"}`}>
                <m.icon className="h-4 w-4" /> {m.label}
              </button>
            )
          ))}
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-sm transition-colors">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        <div className="lg:col-span-3">
          {active === "profile" && (
            <div className="border border-stone-100 p-6 space-y-6">
              <h2 className="font-medium text-stone-900">Profile Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Name</label>
                  <input className="w-full h-10 px-3 border border-stone-200 rounded-sm text-sm" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Email</label>
                  <input className="w-full h-10 px-3 border border-stone-200 rounded-sm text-sm" placeholder="you@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-stone-500 block mb-1">Phone</label>
                  <input className="w-full h-10 px-3 border border-stone-200 rounded-sm text-sm" placeholder="+1 234 567 890" />
                </div>
              </div>
              <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white">Save Changes</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
