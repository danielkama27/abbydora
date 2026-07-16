"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { NotificationBell } from "@/components/NotificationBell";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-abby-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-abby-off-white tracking-wider">
              ABBYDORA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-abby-off-white/80 hover:text-abby-gold transition-colors uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <NotificationBell />
            {user ? (
              <>
                <Link
                  href="/wishlist"
                  className="text-abby-off-white/80 hover:text-abby-gold transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link
                  href="/cart"
                  className="relative text-abby-off-white/80 hover:text-abby-gold transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-abby-gold text-abby-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="text-abby-off-white/80 hover:text-abby-gold transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-abby-black-soft border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm text-abby-off-white font-medium">
                        {user.name || user.email}
                      </p>
                      <p className="text-xs text-abby-off-white/50 capitalize">
                        {user.role}
                      </p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-abby-gold hover:bg-white/5 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-abby-off-white/70 hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-abby-off-white/80 hover:text-abby-gold transition-colors uppercase tracking-widest"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-abby-off-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-abby-black border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-abby-off-white/80 hover:text-abby-gold uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10">
              {user ? (
                <>
                  <Link href="/wishlist" className="block py-2 text-sm text-abby-off-white/70">
                    Wishlist
                  </Link>
                  <Link href="/cart" className="block py-2 text-sm text-abby-off-white/70">
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block py-2 text-sm text-abby-gold">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block py-2 text-sm text-abby-off-white/70"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="block py-2 text-sm text-abby-off-white/70">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
