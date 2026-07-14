"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product, Collection } from "@prisma/client";

export default function CollectionPage() {
  const { slug } = useParams() as { slug: string };
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?collectionId=${slug}&limit=20`).then((r) => r.json()).then((d) => {
      setProducts(d.products);
      if (d.products[0]?.collection) setCollection(d.products[0].collection);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-stone-400 border-t-transparent rounded-full" /></div>;
  if (!collection) return <div className="text-center py-20 text-stone-400">Collection not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/collections" className="text-sm text-stone-400 hover:text-stone-900 flex items-center gap-1 mb-8">
        <ArrowLeft className="h-3 w-3" /> Back to collections
      </Link>

      <div className="mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900">{collection.name}</h1>
        <p className="text-stone-500 mt-2 max-w-xl">{collection.description}</p>
        <p className="text-sm text-stone-400 mt-1">{products.length} products</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-stone-400">No products in this collection</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
