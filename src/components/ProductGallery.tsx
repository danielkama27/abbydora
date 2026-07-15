"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const gallery = images.length > 0 ? images : ["/placeholder.jpg"];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] bg-abby-stone rounded-sm overflow-hidden">
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
      </div>
      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square bg-abby-stone rounded-sm overflow-hidden border-2 transition-colors ${
                active === i ? "border-abby-gold" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
