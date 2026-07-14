import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { role } = await request.json();
  const user = await prisma.user.update({ where: { id: params.id }, data: { role } });
  return NextResponse.json(user);
}
