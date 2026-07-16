"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Collection {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  images: string;
  featured: boolean;
  collectionId: string | null;
}

function firstImage(images: string): string {
  try {
    const arr = JSON.parse(images || "[]");
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : "";
  } catch {
    return "";
  }
}

export default function AdminFeaturedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=200").then((r) => r.json()),
      fetch("/api/collections").then((r) => r.json()),
    ])
      .then(([productsData, collectionsData]) => {
        setProducts(productsData.products || []);
        setCollections(Array.isArray(collectionsData) ? collectionsData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggleFeatured(product: Product) {
    setSavingId(product.id);
    const newValue = !product.featured;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, featured: newValue } : p)));
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newValue }),
      });
    } finally {
      setSavingId(null);
    }
  }

  async function changeCollection(product: Product, collectionId: string) {
    setSavingId(product.id);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, collectionId: collectionId || null } : p)));
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionId: collectionId || null }),
      });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-serif text-3xl font-bold text-abby-black">Featured & Collections</h1>
      </div>
      <p className="text-sm text-abby-black/50 mb-8">
        Featured products appear on your homepage. Assigning a product to a collection groups it under that collection's page.
      </p>

      {loading && <p className="text-abby-black/50">Loading...</p>}

      {!loading && (
        <div className="bg-white rounded-sm border border-abby-stone overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-abby-black/40 border-b border-abby-stone">
                <th className="py-3 pl-6 font-normal">Product</th>
                <th className="py-3 font-normal">Category</th>
                <th className="py-3 font-normal">Collection</th>
                <th className="py-3 pr-6 font-normal text-right">Featured</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-abby-black/40">No products yet.</td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-b border-abby-stone/50 last:border-0">
                  <td className="py-3 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-abby-stone rounded-sm overflow-hidden shrink-0">
                        {firstImage(p.images) && (
                          <img src={firstImage(p.images)} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-abby-black">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-0.5 bg-abby-stone rounded-sm">{p.category}</span>
                  </td>
                  <td className="py-3">
                    <select
                      value={p.collectionId || ""}
                      onChange={(e) => changeCollection(p, e.target.value)}
                      disabled={savingId === p.id}
                      className="px-3 py-1.5 border border-abby-stone rounded-sm text-sm focus:outline-none focus:border-abby-gold"
                    >
                      <option value="">No collection</option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-6 text-right">
                    <button
                      onClick={() => toggleFeatured(p)}
                      disabled={savingId === p.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs transition-colors ${
                        p.featured
                          ? "bg-abby-gold text-abby-black"
                          : "bg-abby-stone text-abby-black/50 hover:text-abby-black"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${p.featured ? "fill-abby-black" : ""}`} />
                      {p.featured ? "Featured" : "Not featured"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
