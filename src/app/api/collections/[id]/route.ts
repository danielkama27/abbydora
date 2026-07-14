import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const collection = await prisma.collection.update({ where: { id: params.id }, data: body });
  return NextResponse.json(collection);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.collection.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
