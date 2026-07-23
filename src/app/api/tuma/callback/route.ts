import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tuma calls this URL automatically once a customer completes (or
// cancels/fails) the bank payment prompt on their phone.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const checkoutRequestId = body.checkout_request_id;
    const status = body.status;

    const order = await prisma.order.findFirst({ where: { bankCheckoutRequestId: checkoutRequestId } });
    if (!order) {
      return NextResponse.json({ success: true, message: "Order not found, acknowledged" });
    }

    // Same idempotency protection as the M-Pesa callback — never let a
    // late/duplicate callback downgrade an already-paid order.
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ success: true, message: "Already recorded as paid" });
    }

    if (status === "completed" && body.result_code === 0) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "paid",
          mpesaReceiptNumber: body.mpesa_receipt_number ? String(body.mpesa_receipt_number) : null,
          status: order.status === "pending" ? "processing" : order.status,
        },
      });
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "failed" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Tuma callback error:", err);
    return NextResponse.json({ success: true, message: "Acknowledged with internal error" });
  }
}
