import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const collectionData = [
    {
      name: "Haute Couture",
      slug: "haute-couture",
      description: "Exclusive, handcrafted luxury pieces for the discerning connoisseur.",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Evening Wear",
      slug: "evening-wear",
      description: "Timeless elegance for your most memorable occasions.",
      image: "https://images.unsplash.com/photo-1566174053879-99a6a5d2c9d2?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Ready-to-Wear",
      slug: "ready-to-wear",
      description: "Contemporary luxury for everyday sophistication.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  const collections = [];
  for (const data of collectionData) {
    const existing = await prisma.collection.findUnique({ where: { slug: data.slug } });
    if (existing) {
      collections.push(existing);
    } else {
      const created = await prisma.collection.create({ data });
      collections.push(created);
    }
  }

  const products = [
    {
      name: "Midnight Velvet Gown",
      description: "A stunning floor-length velvet gown in deep midnight black, featuring a sculpted silhouette and subtle gold embroidery.",
      price: 2890,
      originalPrice: 3200,
      category: "dresses",
      images: JSON.stringify(["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"]),
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      colors: JSON.stringify(["Black", "Navy"]),
      stock: 25,
      inventory: 25,
      featured: true,
      collectionId: collections[0].id,
    },
    {
      name: "Aurelia Silk Dress",
      description: "Elegant silk dress in warm gold tones, perfect for gala evenings and formal receptions.",
      price: 1850,
      category: "dresses",
      images: JSON.stringify(["https://images.unsplash.com/photo-1566174053879-99a6a5d2c9d2?q=80&w=800&auto=format&fit=crop"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      colors: JSON.stringify(["Gold", "Champagne"]),
      stock: 18,
      inventory: 18,
      featured: true,
      collectionId: collections[1].id,
    },
    {
      name: "Obsidian Blazer",
      description: "Tailored blazer in premium wool with satin lapels, embodying power and sophistication.",
      price: 1250,
      category: "blazers",
      images: JSON.stringify(["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"]),
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      colors: JSON.stringify(["Black", "Charcoal"]),
      stock: 30,
      inventory: 30,
      featured: true,
      collectionId: collections[2].id,
    },
    {
      name: "Pearl Essence Blouse",
      description: "Delicate blouse in off-white silk with pearl button details and a flowing silhouette.",
      price: 780,
      originalPrice: 950,
      category: "tops",
      images: JSON.stringify(["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"]),
      sizes: JSON.stringify(["XS", "S", "M", "L"]),
      colors: JSON.stringify(["Off-white", "Cream"]),
      stock: 40,
      inventory: 40,
      featured: false,
      collectionId: collections[2].id,
    },
    {
      name: "Gilded Trousers",
      description: "High-waisted trousers with gold hardware accents, crafted from Italian wool blend.",
      price: 890,
      category: "trousers",
      images: JSON.stringify(["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop"]),
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      colors: JSON.stringify(["Black", "Gold"]),
      stock: 22,
      inventory: 22,
      featured: false,
      collectionId: collections[2].id,
    },
    {
      name: "Noir Evening Clutch",
      description: "Handcrafted leather clutch with gold hardware and satin interior lining.",
      price: 650,
      originalPrice: 780,
      category: "accessories",
      images: JSON.stringify(["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"]),
      sizes: JSON.stringify(["One Size"]),
      colors: JSON.stringify(["Black", "Navy"]),
      stock: 50,
      inventory: 50,
      featured: true,
      collectionId: collections[1].id,
    },
  ];

  for (const data of products) {
    const existing = await prisma.product.findFirst({ where: { name: data.name } });
    if (!existing) {
      await prisma.product.create({ data });
    }
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@abbydora.com" } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@abbydora.com",
        password: hashedPassword,
        role: "admin",
      },
    });
  }

  console.log("✅ Seeded collections, products, and admin user.");
  console.log("   Admin login: admin@abbydora.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
