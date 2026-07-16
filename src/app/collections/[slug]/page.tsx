"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product, Collection } from "@prisma/client";

export default function CollectionPage() {
  const { slug } = useParams() as { slug: string };
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        // Collections are looked up by their real database id when
        // filtering products, not by the slug in the URL — so we first
        // find the matching collection, then use its id.
        const collectionsRes = await fetch("/api/collections");
        const collections: Collection[] = await collectionsRes.json();
        const match = collections.find((c) => c.slug === slug);

        if (!match) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setCollection(match);

        const productsRes = await fetch(`/api/products?collectionId=${match.id}&limit=40`);
        const data = await productsRes.json();
        setProducts(data.products || []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-stone-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (notFound || !collection) {
    return <div className="text-center py-20 text-stone-400">Collection not found</div>;
  }

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
