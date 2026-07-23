import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkSession } from "@/lib/session-helpers";
import { initiateStkPush } from "@/lib/mpesa";
import { initiateBankPush } from "@/lib/tuma";

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
    const { shippingAddress, paymentMethod, mpesaPhone, bankPhone, discountCode } = body;

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

    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Look up real shipping settings server-side too — never trust the
    // client's displayed total for what to actually charge.
    const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    const shippingRate = settings?.shippingRate ?? 15;
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 200;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : shippingRate;

    // Re-validate the discount code ourselves — never trust a discount
    // amount computed on the client.
    let discountAmount = 0;
    let appliedDiscount: { id: string; code: string } | null = null;
    if (discountCode) {
      const discount = await prisma.discount.findUnique({ where: { code: discountCode.trim().toUpperCase() } });
      if (discount && discount.active) {
        const notExpired = !discount.expiresAt || new Date(discount.expiresAt) >= new Date();
        const underLimit = discount.usageLimit === null || discount.timesUsed < discount.usageLimit;
        if (notExpired && underLimit) {
          discountAmount =
            discount.type === "percentage" ? subtotal * (discount.value / 100) : Math.min(discount.value, subtotal);
          appliedDiscount = { id: discount.id, code: discount.code };
        }
      }
    }

    const total = Math.max(0, subtotal + shippingCost - discountAmount);

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

      if (appliedDiscount) {
        await tx.discount.update({
          where: { id: appliedDiscount.id },
          data: { timesUsed: { increment: 1 } },
        });
      }

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

    if (paymentMethod === "bank" && bankPhone) {
      try {
        const push = await initiateBankPush({
          phone: bankPhone,
          amount: total,
          description: `AbbyDora order ${order.id.slice(0, 12).toUpperCase()}`,
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { bankCheckoutRequestId: push.checkoutRequestId },
        });
      } catch (bankErr: any) {
        console.error("Bank payment push failed:", bankErr);
        return NextResponse.json(
          { order, bankError: bankErr?.message || "Could not start bank payment. Your order was saved — please contact us to arrange payment." },
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
