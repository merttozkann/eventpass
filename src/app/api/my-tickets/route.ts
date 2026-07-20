import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = Number(url.searchParams.get("userId"));

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { message: "Kullanıcı bilgisi bulunamadı." },
        { status: 400 }
      );
    }

    const registrations = await prisma.registration.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        event: true,
      },
    });

    return NextResponse.json({
      tickets: registrations,
    });
  } catch (error) {
    console.error("My tickets error:", error);

    return NextResponse.json(
      { message: "Biletler alınırken hata oluştu." },
      { status: 500 }
    );
  }
}