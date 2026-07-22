import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const eventId = Number(id);

    const url = new URL(request.url);
    const userId = Number(url.searchParams.get("userId"));

    if (Number.isNaN(eventId) || Number.isNaN(userId)) {
      return NextResponse.json(
        { message: "Geçersiz etkinlik veya kullanıcı id değeri." },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findFirst({
      where: {
        eventId,
        userId,
      },
    });

    return NextResponse.json({
      isRegistered: Boolean(registration),
      registration,
    });
  } catch (error) {
    console.error("Registration status error:", error);

    return NextResponse.json(
      { message: "Kayıt durumu kontrol edilirken hata oluştu." },
      { status: 500 }
    );
  }
}