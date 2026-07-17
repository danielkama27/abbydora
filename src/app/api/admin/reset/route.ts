import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Deliberately does NOT support deleting Products, Collections, Settings,
// or Announcements — those are real catalog/store data, not "trial" data,
// and this tool is only meant to clear test transactions and test accounts.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      orders,
      reviews,
      messages,
      wishlists,
      carts,
      customers, // deletes non-admin user accounts
      confirm,
    } = body;

    if (confirm !== "RESET") {
      return NextResponse.json({ error: "Confirmation phrase did not match" }, { status: 400 });
    }

    const results: string[] = [];

    if (orders) {
      const { count: itemCount } = await prisma.orderItem.deleteMany({});
      const { count: orderCount } = await prisma.order.deleteMany({});
      results.push(`Deleted ${orderCount} orders (${itemCount} line items)`);
    }
    if (carts) {
      const { count } = await prisma.cartItem.deleteMany({});
      results.push(`Cleared ${count} cart items`);
    }
    if (wishlists) {
      const { count } = await prisma.wishlist.deleteMany({});
      results.push(`Cleared ${count} wishlist items`);
    }
    if (reviews) {
      const { count } = await prisma.review.deleteMany({});
      results.push(`Deleted ${count} reviews`);
    }
    if (messages) {
      const { count } = await prisma.contact.deleteMany({});
      results.push(`Deleted ${count} contact messages`);
    }
    if (customers) {
      // Never delete admin accounts, and never delete the account currently signed in.
      const { count } = await prisma.user.deleteMany({
        where: { role: { not: "admin" }, id: { not: session.user.id } },
      });
      results.push(`Deleted ${count} non-admin customer accounts`);
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("Admin reset error:", err);
    return NextResponse.json({ error: err?.message || "Reset failed" }, { status: 500 });
  }
}
