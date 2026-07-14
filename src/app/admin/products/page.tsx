"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFormModal, ProductFormValues } from "@/components/ProductFormModal";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string;
}

function firstImage(images: string): string {
  try {
    const arr = JSON.parse(images || "[]");
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : "";
  } catch {
    return "";
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium text-stone-900">Products</h1>
        <Button
          className="rounded-none bg-stone-900 hover:bg-stone-800 text-white"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-400 border-b border-stone-100">
                <th className="pb-3 pl-6 font-normal">Product</th>
                <th className="pb-3 font-normal">Price</th>
                <th className="pb-3 font-normal">Stock</th>
                <th className="pb-3 font-normal">Category</th>
                <th className="pb-3 pr-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">Loading...</td>
                </tr>
              )}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">No products yet.</td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-b border-stone-50 last:border-0">
                  <td className="py-3 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-sm overflow-hidden relative">
                        {firstImage(p.images) && (
                          <img src={firstImage(p.images)} alt={p.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-stone-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3">${p.price}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3"><span className="text-xs px-2 py-0.5 bg-stone-100 rounded-sm">{p.category}</span></td>
                  <td className="py-3 pr-6 text-right">
                    <button
                      className="text-stone-400 hover:text-stone-600 mr-3"
                      onClick={() => {
                        setEditing(p);
                        setModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-stone-400 hover:text-red-600" onClick={() => handleDelete(p.id)}>
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          initial={editing || undefined}
          onClose={() => setModalOpen(false)}
          onSaved={loadProducts}
        />
      )}
    </div>
  );
}
