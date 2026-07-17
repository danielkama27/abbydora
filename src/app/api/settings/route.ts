import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getOrCreateSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "singleton" } });
  }
  return settings;
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json(settings);
  } catch (err: any) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ error: err?.message || "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return updateSettings(request);
}

export async function POST(request: Request) {
  return updateSettings(request);
}

async function updateSettings(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      freeShippingThreshold, shippingRate,
      instagramUrl, twitterUrl, facebookUrl,
      tiktokUrl, youtubeUrl, linkedinUrl, pinterestUrl, whatsappNumber,
      heroMediaUrl, heroMediaType, heroPromoText,
    } = body;

    await getOrCreateSettings();
    const updated = await prisma.settings.update({
      where: { id: "singleton" },
      data: {
        ...(freeShippingThreshold !== undefined && { freeShippingThreshold: parseFloat(freeShippingThreshold) }),
        ...(shippingRate !== undefined && { shippingRate: parseFloat(shippingRate) }),
        ...(instagramUrl !== undefined && { instagramUrl: instagramUrl || null }),
        ...(twitterUrl !== undefined && { twitterUrl: twitterUrl || null }),
        ...(facebookUrl !== undefined && { facebookUrl: facebookUrl || null }),
        ...(tiktokUrl !== undefined && { tiktokUrl: tiktokUrl || null }),
        ...(youtubeUrl !== undefined && { youtubeUrl: youtubeUrl || null }),
        ...(linkedinUrl !== undefined && { linkedinUrl: linkedinUrl || null }),
        ...(pinterestUrl !== undefined && { pinterestUrl: pinterestUrl || null }),
        ...(whatsappNumber !== undefined && { whatsappNumber: whatsappNumber || null }),
        ...(heroMediaUrl !== undefined && { heroMediaUrl: heroMediaUrl || null }),
        ...(heroMediaType !== undefined && { heroMediaType: heroMediaType || null }),
        ...(heroPromoText !== undefined && { heroPromoText: heroPromoText || null }),
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update settings" }, { status: 500 });
  }
}
