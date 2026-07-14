"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-abby-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,#c9a96e_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,#c9a96e_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
        <div className="max-w-3xl">
          <p className="text-abby-gold uppercase tracking-[0.3em] text-sm font-medium mb-6">
            Heritage Luxury Fashion
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-abby-off-white leading-[0.95] mb-8">
            Elegance
            <br />
            <span className="italic font-light">Redefined</span>
          </h1>
          <p className="text-lg text-abby-off-white/60 max-w-xl mb-10 leading-relaxed">
            Discover the ABBYDORA collection — where contemporary design meets
            timeless heritage. Crafted for those who demand excellence in every stitch.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-abby-gold text-abby-black px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-abby-gold-light transition-colors"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-abby-off-white/30 text-abby-off-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-abby-gold/50 to-transparent" />
    </section>
  );
}
