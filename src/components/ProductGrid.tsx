"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { categories } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string;
  featured: boolean;
}

interface ProductGridProps {
  products: Product[];
  showFilters?: boolean;
  title?: string;
}

export function ProductGrid({ products, showFilters = true, title }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // newest by default
  });

  return (
    <div>
      {/* Header */}
      {title && (
        <div className="mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-abby-black mb-2">
            {title}
          </h2>
          <div className="w-16 h-0.5 bg-abby-gold" />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                  activeCategory === cat
                    ? "bg-abby-black text-abby-off-white"
                    : "bg-abby-stone text-abby-black/60 hover:bg-abby-black/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-abby-black/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm text-abby-black/60 border-none focus:ring-0 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-abby-black/40 font-serif text-lg">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
