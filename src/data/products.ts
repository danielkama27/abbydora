export interface SampleProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
}

export const sampleProducts: SampleProduct[] = [
  {
    id: "prod-1",
    name: "Classic Wool Overcoat",
    brand: "AbbyDora",
    category: "outerwear",
    price: 289,
    description: "A timeless overcoat crafted from premium Italian wool. Features a tailored silhouette, notched lapels, and full satin lining for all-day comfort. Perfect for elevating any formal or smart-casual look.",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop",
    images: JSON.stringify(["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop"]),
    rating: 4.8,
    reviews: 124,
    colors: ["#2c2c2c", "#6b4c3b", "#1a3a52"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 15,
    featured: true,
  },
  {
    id: "prod-2",
    name: "Silk Evening Dress",
    brand: "AbbyDora",
    category: "dresses",
    price: 345,
    description: "Elegant floor-length evening dress in flowing silk. The subtle cowl neckline and draped back detail create a sophisticated silhouette for special occasions.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop",
    images: JSON.stringify(["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop"]),
    rating: 4.9,
    reviews: 89,
    colors: ["#1a1a1a", "#8b0000", "#2f4f4f"],
    sizes: ["XS", "S", "M", "L"],
    stock: 8,
    featured: true,
  },
  {
    id: "prod-3",
    name: "Tailored Linen Blazer",
    brand: "AbbyDora",
    category: "blazers",
    price: 195,
    description: "A lightweight linen blazer designed for warmer days. Breathable fabric with a structured yet relaxed fit, perfect for business casual or weekend elegance.",
    image: "https://images.unsplash.com/photo-1506629082955-511b1f2db53a?w=800&h=800&fit=crop",
    images: JSON.stringify(["https://images.unsplash.com/photo-1506629082955-511b1f2db53a?w=800&h=800&fit=crop"]),
    rating: 4.6,
    reviews: 56,
    colors: ["#e8e0d5", "#b0a090", "#3c3c3c"],
    sizes: ["S", "M", "L", "XL"],
    stock: 22,
    featured: false,
  },
  {
    id: "prod-4",
    name: "Cashmere Turtleneck",
    brand: "AbbyDora",
    category: "knitwear",
    price: 165,
    description: "Ultra-soft cashmere turtleneck with a relaxed fit. Designed for layering, this piece brings warmth and understated luxury to your everyday wardrobe.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop",
    images: JSON.stringify(["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop"]),
    rating: 4.7,
    reviews: 102,
    colors: ["#f5f5f0", "#d2b48c", "#2f2f2f"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 30,
    featured: true,
  },
  {
    id: "prod-5",
    name: "Pleated Midi Skirt",
    brand: "AbbyDora",
    category: "skirts",
    price: 125,
    description: "A refined pleated midi skirt with gentle movement. The high waist and flowing drape make it a versatile staple for both office and evening wear.",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=800&fit=crop",
    images: JSON.stringify(["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=800&fit=crop"]),
    rating: 4.5,
    reviews: 43,
    colors: ["#c0b0a0", "#1a1a1a", "#556b2f"],
    sizes: ["XS", "S", "M", "L"],
    stock: 18,
    featured: false,
  },
  {
    id: "prod-6",
    name: "Leather Crossbody Bag",
    brand: "AbbyDora",
    category: "accessories",
    price: 210,
    description: "Handcrafted from full-grain leather, this crossbody bag features clean lines and a compact design. Adjustable strap and interior compartments for everyday essentials.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop",
    images: JSON.stringify(["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop"]),
    rating: 4.8,
    reviews: 67,
    colors: ["#3c2f2f", "#8b7d6b", "#000000"],
    sizes: ["One Size"],
    stock: 12,
    featured: true,
  },
  {
    id: "prod-7",
    name: "Wide-Leg Trousers",
    brand: "AbbyDora",
    category: "trousers",
    price: 145,
    description: "High-rise wide-leg trousers in a premium wool blend. The flattering cut and clean waistband create an effortlessly polished look.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
    images: JSON.stringify(["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"]),
    rating: 4.4,
    reviews: 38,
    colors: ["#1a1a1a", "#d2b48c", "#556b2f"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 20,
    featured: false,
  },
  {
    id: "prod-8",
    name: "Minimalist Gold Watch",
    brand: "AbbyDora",
    category: "accessories",
    price: 395,
    description: "A refined timepiece with a slim gold-tone case and genuine leather strap. Water-resistant and powered by a reliable Japanese quartz movement.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop",
    images: JSON.stringify(["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop"]),
    rating: 4.9,
    reviews: 45,
    colors: ["#d4af37", "#c0c0c0"],
    sizes: ["One Size"],
    stock: 6,
    featured: true,
  },
];

export function getProductById(id: string): SampleProduct | undefined {
  return sampleProducts.find((p) => p.id === id);
}

export function getRelatedProducts(excludeId: string): SampleProduct[] {
  const product = getProductById(excludeId);
  if (!product) return sampleProducts.slice(0, 4);
  return sampleProducts
    .filter((p) => p.id !== excludeId && p.category === product.category)
    .slice(0, 4);
}
