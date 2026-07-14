"use server";

import { prisma } from "@/lib/prisma";

export async function seedDatabase() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    return { success: false, message: "Database already seeded." };
  }

  const collections = [
    { name: "Spring Essentials", slug: "spring-essentials", description: "Light fabrics and fresh palettes for the season.", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop" },
    { name: "Evening Edit", slug: "evening-edit", description: "Elegant pieces for after-dark occasions.", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop" },
    { name: "Urban Minimalist", slug: "urban-minimalist", description: "Clean lines and timeless silhouettes.", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop" },
  ];

  for (const c of collections) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const products = [
    { name: "Classic Wool Overcoat", description: "A timeless overcoat crafted from premium Italian wool.", price: 289, category: "outerwear", stock: 15, featured: true, images: JSON.stringify(["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop"]) },
    { name: "Silk Evening Dress", description: "Elegant floor-length evening dress in flowing silk.", price: 345, category: "dresses", stock: 8, featured: true, images: JSON.stringify(["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop"]) },
    { name: "Tailored Linen Blazer", description: "A lightweight linen blazer designed for warmer days.", price: 195, category: "blazers", stock: 22, featured: false, images: JSON.stringify(["https://images.unsplash.com/photo-1506629082955-511b1f2db53a?w=800&h=800&fit=crop"]) },
    { name: "Cashmere Turtleneck", description: "Ultra-soft cashmere turtleneck with a relaxed fit.", price: 165, category: "knitwear", stock: 30, featured: true, images: JSON.stringify(["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop"]) },
    { name: "Pleated Midi Skirt", description: "A refined pleated midi skirt with gentle movement.", price: 125, category: "skirts", stock: 18, featured: false, images: JSON.stringify(["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=800&fit=crop"]) },
    { name: "Leather Crossbody Bag", description: "Handcrafted from full-grain leather with clean lines.", price: 210, category: "accessories", stock: 12, featured: true, images: JSON.stringify(["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop"]) },
    { name: "Wide-Leg Trousers", description: "High-rise wide-leg trousers in a premium wool blend.", price: 145, category: "trousers", stock: 20, featured: false, images: JSON.stringify(["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"]) },
    { name: "Minimalist Gold Watch", description: "A refined timepiece with a slim gold-tone case.", price: 395, category: "accessories", stock: 6, featured: true, images: JSON.stringify(["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop"]) },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  return { success: true, message: "Database seeded successfully." };
}
