import Link from "next/link";
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { collection: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs tracking-[0.3em] uppercase text-stone-500">New Collection</span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] text-stone-900">
              Elegance<br />Redefined
            </h1>
            <p className="text-stone-500 text-lg max-w-md leading-relaxed">
              Discover timeless pieces crafted with precision and designed to transcend seasons. Where quality meets modern sophistication.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/shop">
                <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white px-8 h-12 text-sm tracking-wide">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/collections">
                <Button variant="outline" className="rounded-none px-8 h-12 text-sm tracking-wide border-stone-300 hover:bg-stone-100">
                  View Collections
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-sm overflow-hidden bg-stone-200">
            <img
              src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&h=1600&fit=crop"
              alt="Fashion hero"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $100" },
              { icon: Shield, label: "Secure Payment", desc: "100% protected" },
              { icon: ShoppingBag, label: "Easy Returns", desc: "30-day policy" },
              { icon: Star, label: "Premium Quality", desc: "Handcrafted pieces" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <f.icon className="h-5 w-5 text-stone-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-stone-900">{f.label}</p>
                  <p className="text-xs text-stone-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-stone-400 block mb-3">Curated Selection</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900">Featured Products</h2>
            </div>
            <Link href="/shop" className="text-sm text-stone-500 hover:text-stone-900 transition-colors hidden sm:flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.3em] uppercase text-stone-400 block mb-3">Explore</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900">Our Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-stone-400 block mb-3">Stay Updated</span>
          <h2 className="font-serif text-3xl font-medium text-stone-900 mb-4">Join Our Newsletter</h2>
          <p className="text-stone-500 mb-8">Be the first to know about new arrivals, exclusive offers, and styling tips.</p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 bg-white border border-stone-200 rounded-none text-sm focus:outline-none focus:border-stone-400"
            />
            <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white h-12 px-6">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
}
