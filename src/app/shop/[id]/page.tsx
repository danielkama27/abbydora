import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductActions } from "@/components/ProductActions";

async function getProduct(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

async function getRelatedProducts(category: string, excludeId: string) {
  return prisma.product.findMany({
    where: { category, NOT: { id: excludeId } },
    take: 4,
  });
}

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  if (!product) return notFound();

  const images = JSON.parse(product.images || "[]");
  const related = await getRelatedProducts(product.category, product.id);

  return (
    <div className="bg-abby-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-abby-black/50 hover:text-abby-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-abby-stone rounded-sm overflow-hidden">
              <Image
                src={images[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img: string, i: number) => (
                  <div key={i} className="relative aspect-square bg-abby-stone rounded-sm overflow-hidden">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs text-abby-gold uppercase tracking-[0.3em] font-medium mb-3">
              {product.category}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-abby-black mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-abby-black mb-6">
              {formatPrice(product.price)}
            </p>
            <p className="text-abby-black/60 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-abby-black/50">
                <Check className="w-4 h-4 text-abby-gold" />
                Premium quality materials
              </div>
              <div className="flex items-center gap-2 text-sm text-abby-black/50">
                <Check className="w-4 h-4 text-abby-gold" />
                Handcrafted with precision
              </div>
              <div className="flex items-center gap-2 text-sm text-abby-black/50">
                <Check className="w-4 h-4 text-abby-gold" />
                Free shipping on orders over $100
              </div>
            </div>

            <ProductActions productId={product.id} stock={product.stock} />

            <div className="mt-8 pt-8 border-t border-abby-stone">
              <p className="text-xs text-abby-black/30 uppercase tracking-widest mb-2">
                Stock Status
              </p>
              <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ProductGrid products={related} title="You May Also Like" showFilters={false} />
        </div>
      )}
    </div>
  );
}
