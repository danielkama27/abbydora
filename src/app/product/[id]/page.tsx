import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, ShoppingBag, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { sampleProducts, getProductById, getRelatedProducts } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  return { title: product ? `${product.name} | AbbyDora` : "Product | AbbyDora" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return notFound();

  const related = getRelatedProducts(id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/category/${product.category}`} className="hover:text-stone-900 transition-colors capitalize">{product.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="bg-stone-50 aspect-square overflow-hidden relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">{product.brand}</p>
            <h1 className="font-serif text-3xl font-medium text-stone-900">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-stone-200"}`} />
                ))}
              </div>
              <span className="text-sm text-stone-400">({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-2xl font-light text-stone-900">{formatPrice(product.price)}</p>
          <p className="text-stone-500 leading-relaxed">{product.description}</p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-stone-900">Color</p>
            <div className="flex gap-2">
              {product.colors?.map((c) => (
                <button key={c} className="w-8 h-8 rounded-full border border-stone-200" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-stone-900">Size</p>
            <div className="flex gap-2">
              {product.sizes?.map((s) => (
                <button key={s} className="w-10 h-10 border border-stone-200 flex items-center justify-center text-sm hover:border-stone-900 transition-colors">{s}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button className="flex-1 rounded-none h-12 bg-stone-900 hover:bg-stone-800 text-white">
              <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button variant="outline" className="rounded-none h-12 w-12 border-stone-200">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-stone-100 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-medium text-stone-900">You May Also Like</h2>
            <Link href="/shop" className="text-sm text-stone-900 underline underline-offset-4">View All</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return sampleProducts.map((p) => ({ id: p.id }));
}
