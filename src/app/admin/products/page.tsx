"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleProducts } from "@/data/products";

export default function AdminProductsPage() {
  const [products] = useState(sampleProducts);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium text-stone-900">Products</h1>
        <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white">
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
              {products.map((p) => (
                <tr key={p.id} className="border-b border-stone-50 last:border-0">
                  <td className="py-3 pl-6">
                    <Link href={`/product/${p.id}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 bg-stone-100 rounded-sm overflow-hidden relative">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-stone-900 group-hover:underline">{p.name}</span>
                    </Link>
                  </td>
                  <td className="py-3">${p.price}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3"><span className="text-xs px-2 py-0.5 bg-stone-100 rounded-sm">{p.category}</span></td>
                  <td className="py-3 pr-6 text-right">
                    <button className="text-stone-400 hover:text-stone-600 mr-3"><Edit className="h-4 w-4" /></button>
                    <button className="text-stone-400 hover:text-red-600"><Trash className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
