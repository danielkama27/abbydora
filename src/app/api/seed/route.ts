import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const seedData = {
  collections: [
    { name: "Essentials", description: "Everyday must-haves", slug: "essentials" },
    { name: "Signature", description: "Premium signature pieces", slug: "signature" },
    { name: "Limited Edition", description: "Exclusive limited drops", slug: "limited-edition" },
  ],
  products: [
    {
      name: "Classic Linen Shirt",
      description: "Handcrafted from premium European linen with a relaxed fit, perfect for any season. Features mother-of-pearl buttons and French seams.",
      price: 89,
      originalPrice: 110,
      category: "Clothing",
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598033121883-c82602e38c65?w=800&h=800&fit=crop"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Cream", "Sage"],
      inventory: 120,
      featured: true,
    },
    {
      name: "Silk Wrap Dress",
      description: "Elegant wrap dress crafted from 100% mulberry silk with a flowing silhouette. Adjustable tie waist and 3/4 length sleeves.",
      price: 185,
      originalPrice: 240,
      category: "Clothing",
      images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Rose", "Navy", "Black"],
      inventory: 85,
      featured: true,
    },
    {
      name: "Cashmere Blend Cardigan",
      description: "Luxurious cashmere blend cardigan with ribbed cuffs and hem. Features functional pockets and a relaxed drape.",
      price: 145,
      originalPrice: 195,
      category: "Clothing",
      images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&h=800&fit=crop"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Camel", "Heather Grey", "Navy"],
      inventory: 60,
      featured: false,
    },
    {
      name: "Tailored Wool Blazer",
      description: "Italian wool blend blazer with a modern tailored fit. Fully lined with satin, featuring a notched lapel and single-button closure.",
      price: 220,
      originalPrice: 280,
      category: "Clothing",
      images: ["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=800&fit=crop"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Charcoal", "Navy", "Burgundy"],
      inventory: 45,
      featured: true,
    },
    {
      name: "Organic Cotton T-Shirt",
      description: "Premium organic cotton t-shirt with a relaxed fit. Pre-shrunk and garment-washed for ultimate softness.",
      price: 45,
      originalPrice: 55,
      category: "Clothing",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=800&fit=crop"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["White", "Black", "Heather Grey", "Olive"],
      inventory: 200,
      featured: false,
    },
    {
      name: "Wide Leg Trousers",
      description: "High-waisted wide-leg trousers with a flowing drape. Crafted from a breathable viscose blend with a side zip closure.",
      price: 115,
      originalPrice: 150,
      category: "Clothing",
      images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1594633312852-1499d2319a96?w=800&h=800&fit=crop"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Cream", "Terracotta"],
      inventory: 75,
      featured: false,
    },
    {
      name: "Merino Wool Sweater",
      description: "Ultra-soft merino wool sweater with a classic crew neck. Naturally temperature-regulating and odor-resistant.",
      price: 120,
      originalPrice: 160,
      category: "Clothing",
      images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=800&fit=crop"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Ivory", "Charcoal", "Forest Green"],
      inventory: 90,
      featured: true,
    },
    {
      name: "Linen Blend Shorts",
      description: "Relaxed-fit linen blend shorts with a drawstring waist and side pockets. Perfect for warm weather adventures.",
      price: 65,
      originalPrice: 85,
      category: "Clothing",
      images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Sand", "Olive", "Navy"],
      inventory: 110,
      featured: false,
    },
    {
      name: "Minimalist Leather Belt",
      description: "Hand-stitched full-grain leather belt with a brushed brass buckle. Age beautifully over time.",
      price: 55,
      originalPrice: 75,
      category: "Accessories",
      images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"],
      sizes: ["S", "M", "L"],
      colors: ["Brown", "Black", "Tan"],
      inventory: 150,
      featured: false,
    },
    {
      name: "Canvas Tote Bag",
      description: "Heavy-duty organic cotton canvas tote with reinforced straps and interior pocket. Perfect for daily essentials.",
      price: 35,
      originalPrice: 45,
      category: "Accessories",
      images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"],
      sizes: ["One Size"],
      colors: ["Natural", "Black", "Olive"],
      inventory: 180,
      featured: true,
    },
    {
      name: "Linen Scarf",
      description: "Lightweight linen scarf with raw edges and a subtle sheen. Versatile styling for any season.",
      price: 48,
      originalPrice: 65,
      category: "Accessories",
      images: ["https://images.unsplash.com/photo-1601924994987-69e26d50a67f?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1550614000-4b9519e02c4a?w=800&h=800&fit=crop"],
      sizes: ["One Size"],
      colors: ["Cream", "Sage", "Dusty Rose"],
      inventory: 95,
      featured: false,
    },
    {
      name: "Suede Loafers",
      description: "Handcrafted suede loafers with a leather sole and cushioned insole. Classic design for any occasion.",
      price: 165,
      originalPrice: 210,
      category: "Footwear",
      images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop"],
      sizes: ["36", "37", "38", "39", "40", "41", "42"],
      colors: ["Tan", "Navy", "Black"],
      inventory: 55,
      featured: true,
    },
  ],
};

import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Safety check: never touch a store that already has real products.
  // This makes it impossible for this route to ever wipe real data again,
  // even if it's visited by accident.
  const existingProductCount = await prisma.product.count();
  if (existingProductCount > 0) {
    return NextResponse.json({
      success: false,
      message: `Skipped — your store already has ${existingProductCount} product(s). This tool only adds starter data to a completely empty store, and never deletes anything.`,
    });
  }

  for (const collection of seedData.collections) {
    const existing = await prisma.collection.findUnique({ where: { slug: collection.slug } });
    if (!existing) {
      await prisma.collection.create({ data: collection });
    }
  }

  const collections = await prisma.collection.findMany();
  const collMap = new Map(collections.map((c) => [c.name, c.id]));

  for (const product of seedData.products) {
    const collId =
      product.name === "Tailored Wool Blazer" || product.name === "Silk Wrap Dress"
        ? collMap.get("Signature")
        : product.name === "Cashmere Blend Cardigan" || product.name === "Suede Loafers"
        ? collMap.get("Limited Edition")
        : collMap.get("Essentials");
    const { images, sizes, colors, ...rest } = product as any;
    await prisma.product.create({
      data: {
        ...rest,
        images: JSON.stringify(images),
        sizes: JSON.stringify(sizes),
        colors: JSON.stringify(colors),
        collectionId: collId,
      },
    });
  }

  return NextResponse.json({ success: true, message: "Starter products added successfully!" });
}
