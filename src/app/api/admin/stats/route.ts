import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalUsers, totalOrders, totalProducts, totalRevenue, onlineOrders, posOrders, recentOrders, topProducts] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({ _sum: { total: true } }).then((r) => r._sum.total || 0),
    prisma.order.count({ where: { channel: "online" } }),
    prisma.order.count({ where: { channel: "pos" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } }, user: true },
    }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return NextResponse.json({
    stats: { totalUsers, totalOrders, totalProducts, totalRevenue, onlineOrders, posOrders },
    recentOrders,
    topProducts,
  });
}
