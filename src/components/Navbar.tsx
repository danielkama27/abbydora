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
  Search,
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
    <nav className="sticky top-0 z-50 bg-abby-cream/95 backdrop-blur-sm border-b border-abby-stone">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Desktop Nav — left */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-abby-black hover:text-abby-gold transition-colors uppercase tracking-[0.14em]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo — centered crest */}
          <Link href="/" className="flex items-center justify-center">
            <span className="font-serif text-sm tracking-[0.05em] text-abby-black border border-abby-black w-10 h-10 rounded-full flex items-center justify-center">
              AD
            </span>
          </Link>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button aria-label="Search" className="text-abby-black hover:text-abby-gold transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <NotificationBell />
            {user ? (
              <>
                <Link
                  href="/wishlist"
                  className="text-abby-black hover:text-abby-gold transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  className="relative text-abby-black hover:text-abby-gold transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-abby-black text-abby-off-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="text-abby-black hover:text-abby-gold transition-colors">
                    <User className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-abby-stone rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3 border-b border-abby-stone">
                      <p className="text-sm text-abby-black font-medium">
                        {user.name || user.email}
                      </p>
                      <p className="text-xs text-abby-black/50 capitalize">
                        {user.role}
                      </p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-abby-gold hover:bg-abby-cream transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-abby-black/70 hover:bg-abby-cream transition-colors"
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
                className="text-xs font-medium text-abby-black hover:text-abby-gold transition-colors uppercase tracking-[0.14em]"
              >
                Account
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-abby-black"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-abby-cream border-t border-abby-stone">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-abby-black uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-abby-stone">
              {user ? (
                <>
                  <Link href="/wishlist" className="block py-2 text-sm text-abby-black/70">
                    Wishlist
                  </Link>
                  <Link href="/cart" className="block py-2 text-sm text-abby-black/70">
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block py-2 text-sm text-abby-gold">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block py-2 text-sm text-abby-black/70"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="block py-2 text-sm text-abby-black/70">
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
