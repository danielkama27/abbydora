import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    currencyDisplay: "symbol",
  }).format(price);
}

export const categories = [
  "T-Shirts",
  "Hoodies",
  "Polo Shirts",
  "Trousers",
  "Accessories",
] as const;
