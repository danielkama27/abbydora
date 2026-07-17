import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkSession } from "@/lib/session-helpers";
import { initiateStkPush } from "@/lib/mpesa";

// Customer-facing: only ever returns the signed-in user's own orders.
export async function GET() {
  const session = await checkSession();
  if (session.status === "unauthenticated") {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }
  if (session.status === "stale") {
    return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });
  }
  const userId = session.userId;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ error: err?.message || "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return placeOrder(request);
}

export async function PUT(request: Request) {
  return placeOrder(request);
}

async function placeOrder(request: Request) {
  const session = await checkSession();
  if (session.status === "unauthenticated") {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }
  if (session.status === "stale") {
    return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });
  }
  const userId = session.userId;

  try {
    const body = await request.json();
    const { shippingAddress, paymentMethod, mpesaPhone } = body;

    // Always build the order from the user's actual server-side cart —
    // never trust prices/items the client claims, and never trust a
    // client-supplied userId. This also prevents wiping other users' carts.
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    }

    // Verify stock (including per-size stock where applicable) before committing.
    for (const item of cartItems) {
      if (item.size) {
        let sizeStock: Record<string, number> = {};
        try {
          sizeStock = JSON.parse(item.product.sizes || "{}");
        } catch {}
        const available = sizeStock[item.size] ?? 0;
        if (available < item.quantity) {
          return NextResponse.json(
            { error: `${item.product.name} (size ${item.size}) doesn't have enough stock.` },
            { status: 400 }
          );
        }
      } else if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${item.product.name} doesn't have enough stock.` },
          { status: 400 }
        );
      }
    }

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          total,
          status: "pending",
          shippingAddress: shippingAddress || null,
          paymentMethod: paymentMethod || "cash",
          paymentStatus: "pending",
          mpesaPhone: paymentMethod === "mpesa" ? mpesaPhone : null,
          items: {
            createMany: {
              data: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
                size: item.size,
                color: item.color,
              })),
            },
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Decrement stock — per-size where applicable, otherwise the flat count.
      for (const item of cartItems) {
        if (item.size) {
          let sizeStock: Record<string, number> = {};
          try {
            sizeStock = JSON.parse(item.product.sizes || "{}");
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

      // Only clear THIS user's cart, never everyone's.
      await tx.cartItem.deleteMany({ where: { userId } });

      return created;
    });

    // If paying by M-Pesa, trigger the payment prompt now that the order exists.
    // If this fails (e.g. M-Pesa not configured yet), the order still stands —
    // it's just left as an unpaid cash-equivalent order the admin can follow up on.
    if (paymentMethod === "mpesa" && mpesaPhone) {
      try {
        const stk = await initiateStkPush({
          phone: mpesaPhone,
          amount: total,
          accountReference: order.id.slice(0, 12).toUpperCase(),
          transactionDesc: "AbbyDora order",
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { mpesaCheckoutRequestId: stk.checkoutRequestId },
        });
      } catch (mpesaErr: any) {
        console.error("M-Pesa STK push failed:", mpesaErr);
        return NextResponse.json(
          { order, mpesaError: mpesaErr?.message || "Could not start M-Pesa payment. Your order was saved — please contact us to arrange payment." },
          { status: 201 }
        );
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("Orders POST error:", err);
    return NextResponse.json({ error: err?.message || "Failed to place order" }, { status: 500 });
  }
}
