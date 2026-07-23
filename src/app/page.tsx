import Link from "next/link";
import { ShoppingBag, Truck, Shield, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";
import { NewsletterForm } from "@/components/NewsletterForm";
import { FadeInSection } from "@/components/FadeInSection";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { HeroParallax, CrestReveal, HeroTextReveal } from "@/components/HeroMotion";
import { Marquee } from "@/components/Marquee";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { collection: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  const freeShippingThreshold = settings?.freeShippingThreshold ?? 200;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[680px] flex flex-col items-center justify-center text-center overflow-hidden">
        <HeroParallax>
          {settings?.heroMediaType === "video" && settings?.heroMediaUrl ? (
            <video
              src={settings.heroMediaUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay loop muted playsInline
            />
          ) : (
            <img
              src={settings?.heroMediaUrl || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=1200&fit=crop"}
              alt="AbbyDora"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </HeroParallax>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
        <div className="relative z-10 px-6 text-white">
          <CrestReveal>
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/60 font-serif text-sm mb-6">
              AD
            </span>
          </CrestReveal>
          {settings?.heroPromoText && (
            <HeroTextReveal delay={0.15}>
              <div className="mb-4">
                <span className="inline-block bg-abby-gold text-abby-black text-xs font-bold px-4 py-2 tracking-widest uppercase">
                  {settings.heroPromoText}
                </span>
              </div>
            </HeroTextReveal>
          )}
          <HeroTextReveal delay={0.25}>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-medium leading-[0.95]">
              Excellentia
            </h1>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-white/50 leading-[0.95] mb-6">
              Et Traditio
            </h1>
          </HeroTextReveal>
          <HeroTextReveal delay={0.4}>
            <p className="font-serif italic text-lg sm:text-xl text-white/85 max-w-xl mx-auto leading-relaxed">
              An old-world tailor's atelier that dresses a modern streetwear crowd. Disciplined, monumental, quietly confident.
            </p>
          </HeroTextReveal>
        </div>
      </section>

      {/* Tab bar */}
      <div className="flex justify-center bg-abby-black">
        <Link href="/shop" className="font-serif text-sm sm:text-base tracking-wide px-8 sm:px-14 py-5 bg-abby-cream text-abby-black">
          Explore Collections
        </Link>
        <Link href="/about" className="font-serif text-sm sm:text-base tracking-wide px-8 sm:px-14 py-5 text-white/80 hover:text-white transition-colors">
          Our Heritage
        </Link>
      </div>

      {/* Marquee */}
      <Marquee
        items={[
          `Free Shipping Over ${formatPrice(freeShippingThreshold)}`,
          "M-Pesa & Bank Accepted",
          "Nairobi Delivery",
          "Structural. Sophisticated. Timeless.",
        ]}
      />

      {/* Features strip */}
      <section className="py-10 border-b border-abby-stone bg-abby-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, label: "Free Shipping", desc: `On orders over ${formatPrice(freeShippingThreshold)}` },
              { icon: Shield, label: "Secure Payment", desc: "M-Pesa protected" },
              { icon: ShoppingBag, label: "Easy Returns", desc: "7-day policy" },
              { icon: Star, label: "Premium Quality", desc: "Handcrafted pieces" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <f.icon className="h-5 w-5 text-abby-black/40 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-abby-black">{f.label}</p>
                  <p className="text-xs text-abby-black/40">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="py-24 bg-abby-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
              <div>
                <h2 className="font-serif text-4xl font-medium text-abby-black mb-3">Featured Pieces</h2>
                <p className="text-xs uppercase tracking-widest text-abby-black/40 max-w-sm">
                  Curated selections defining the AbbyDora structural aesthetic.
                </p>
              </div>
              <Link href="/shop" className="text-xs uppercase tracking-widest text-abby-black underline underline-offset-4 whitespace-nowrap">
                View all products
              </Link>
            </div>
          </FadeInSection>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Collections */}
      <section className="py-24 bg-abby-cream-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-14">
              <h2 className="font-serif text-4xl font-medium text-abby-black">The Collections</h2>
            </div>
          </FadeInSection>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((c) => (
              <StaggerItem key={c.id}>
                <Link href={`/collections/${c.slug}`} className="relative aspect-[3/4] overflow-hidden block group">
                  <img
                    src={c.image || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=650&fit=crop"}
                    alt={c.name}
                    className="w-full h-full object-cover brightness-[0.72] group-hover:brightness-[0.6] group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute bottom-7 left-7 text-white">
                    <span className="block text-[11px] uppercase tracking-widest text-white/70 mb-1">
                      {c._count.products} {c._count.products === 1 ? "piece" : "pieces"}
                    </span>
                    <h3 className="font-serif text-2xl font-medium">{c.name}</h3>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* The Detail Is The Design */}
      <section className="py-24 bg-abby-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <FadeInSection>
            <img
              src={settings?.detailImageUrl || "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=700&h=700&fit=crop"}
              alt="Packaging detail"
              className="w-full aspect-square object-cover"
            />
          </FadeInSection>
          <FadeInSection delay={0.15}>
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl font-medium text-abby-black leading-tight mb-6">
                The Detail is<br />The Design.
              </h2>
              <p className="text-abby-black/60 leading-relaxed max-w-md mb-8">
                Every ABBYDORA garment is delivered with the exactitude of bespoke tailoring. Matte off-white papers, structural black ribbons, and frosted garment covers reflect a dedication to form that begins long before the piece is worn.
              </p>
              <Link
                href="/about"
                className="inline-block border border-abby-black px-8 py-4 text-xs uppercase tracking-widest text-abby-black hover:bg-abby-black hover:text-abby-off-white transition-colors"
              >
                Discover the heritage
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-abby-cream-2">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="font-serif text-3xl font-medium text-abby-black mb-4">Join Our Newsletter</h2>
            <p className="text-abby-black/50 mb-8">Be the first to know about new arrivals, exclusive offers, and styling tips.</p>
            <NewsletterForm />
          </FadeInSection>
        </div>
      </section>
    </>
  );
}
