import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) return NextResponse.json({ error: "Enter a code" }, { status: 400 });

    const discount = await prisma.discount.findUnique({ where: { code: code.trim().toUpperCase() } });
    if (!discount || !discount.active) {
      return NextResponse.json({ error: "Invalid or inactive code" }, { status: 404 });
    }
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This code has expired" }, { status: 400 });
    }
    if (discount.usageLimit !== null && discount.timesUsed >= discount.usageLimit) {
      return NextResponse.json({ error: "This code has reached its usage limit" }, { status: 400 });
    }

    const discountAmount =
      discount.type === "percentage"
        ? (subtotal || 0) * (discount.value / 100)
        : Math.min(discount.value, subtotal || 0);

    return NextResponse.json({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount,
    });
  } catch (err: any) {
    console.error("Discount validate error:", err);
    return NextResponse.json({ error: "Could not validate code" }, { status: 500 });
  }
}
