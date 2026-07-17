import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Safaricom calls this URL automatically after the customer completes (or
// cancels/fails) the STK push payment prompt on their phone. This route is
// public by necessity — Safaricom's servers call it directly, not the
// customer's browser — but it only ever updates an order matched by the
// checkoutRequestId that *we* generated and gave to Safaricom, so it can't
// be used to tamper with unrelated orders.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const callback = body?.Body?.stkCallback;
    if (!callback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Ignored — no callback body" });
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;

    const order = await prisma.order.findFirst({ where: { mpesaCheckoutRequestId: checkoutRequestId } });
    if (!order) {
      // Nothing to match — acknowledge anyway so Safaricom doesn't retry forever.
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Order not found, acknowledged" });
    }

    // Safaricom can call this URL more than once for the same payment
    // (retries, duplicate confirmations — especially common in sandbox).
    // Once an order is genuinely marked paid, never let a later callback
    // downgrade it — that would incorrectly flip a successful payment to
    // "failed" if a stale/duplicate callback arrives after the real one.
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Already recorded as paid, ignored" });
    }

    if (resultCode === 0) {
      // Payment succeeded — pull the M-Pesa receipt number out of the callback metadata.
      const items = callback.CallbackMetadata?.Item || [];
      const receipt = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "paid",
          mpesaReceiptNumber: receipt ? String(receipt) : null,
          status: order.status === "pending" ? "processing" : order.status,
        },
      });
    } else {
      // Payment failed, was cancelled, or timed out.
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "failed" },
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err: any) {
    console.error("M-Pesa callback error:", err);
    // Still return 200 — Safaricom will keep retrying otherwise, and we've
    // already logged the issue for follow-up.
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Acknowledged with internal error" });
  }
}
