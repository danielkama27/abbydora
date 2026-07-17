import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface SaleItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, guestName, guestPhone, paymentMethod } = body as {
      items: SaleItem[];
      guestName?: string;
      guestPhone?: string;
      paymentMethod: "cash" | "mpesa";
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in this sale" }, { status: 400 });
    }

    // Look up real products and prices — never trust prices from the client.
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: "One of the selected products no longer exists" }, { status: 400 });
      }
      if (item.size) {
        let sizeStock: Record<string, number> = {};
        try {
          sizeStock = JSON.parse(product.sizes || "{}");
        } catch {}
        if ((sizeStock[item.size] ?? 0) < item.quantity) {
          return NextResponse.json({ error: `${product.name} (size ${item.size}) doesn't have enough stock.` }, { status: 400 });
        }
      } else if (product.stock < item.quantity) {
        return NextResponse.json({ error: `${product.name} doesn't have enough stock.` }, { status: 400 });
      }
    }

    const total = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          total,
          status: "delivered", // in-store purchases are complete on the spot
          channel: "pos",
          paymentMethod,
          paymentStatus: "paid", // staff confirms payment at the counter before completing the sale
          guestName: guestName || null,
          guestPhone: guestPhone || null,
          items: {
            createMany: {
              data: items.map((item) => {
                const product = products.find((p) => p.id === item.productId)!;
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: product.price,
                  size: item.size || null,
                  color: item.color || null,
                };
              }),
            },
          },
        },
        include: { items: { include: { product: true } } },
      });

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)!;
        if (item.size) {
          let sizeStock: Record<string, number> = {};
          try {
            sizeStock = JSON.parse(product.sizes || "{}");
          } catch {}
          sizeStock[item.size] = Math.max(0, (sizeStock[item.size] ?? 0) - item.quantity);
          const newTotalStock = Object.values(sizeStock).reduce((s, n) => s + (n || 0), 0);
          await tx.product.update({
            where: { id: item.productId },
            data: { sizes: JSON.stringify(sizeStock), stock: newTotalStock },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return created;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("POS sale error:", err);
    return NextResponse.json({ error: err?.message || "Failed to complete sale" }, { status: 500 });
  }
}
