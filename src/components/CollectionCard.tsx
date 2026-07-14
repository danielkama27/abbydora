"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    _count: { products: number };
  };
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.slug}`} className="group block relative overflow-hidden rounded-sm">
      <div className="relative aspect-[4/3] bg-abby-stone overflow-hidden">
        <Image
          src={collection.image || "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop"}
          alt={collection.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abby-black/80 via-abby-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-xs text-abby-gold uppercase tracking-[0.2em] mb-2">
            {collection._count.products} {collection._count.products === 1 ? "Piece" : "Pieces"}
          </p>
          <h3 className="font-serif text-2xl font-medium text-abby-off-white mb-2 group-hover:text-abby-gold transition-colors">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-sm text-abby-off-white/70 line-clamp-2 mb-3">
              {collection.description}
            </p>
          )}
          <span className="inline-flex items-center gap-2 text-sm text-abby-off-white/80 group-hover:text-abby-gold transition-colors">
            Explore Collection <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
