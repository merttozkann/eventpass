import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrCode } = body;

    if (!qrCode || typeof qrCode !== "string") {
      return NextResponse.json(
        { message: "QR kod zorunludur." },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: {
        qrCode,
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        event: {
          select: {
            title: true,
            location: true,
            eventDate: true,
          },
        },
      },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Bu QR koda ait kayıt bulunamadı." },
        { status: 404 }
      );
    }

    if (registration.status === "ATTENDED") {
      return NextResponse.json(
        {
          message: "Bu bilet zaten daha önce okutulmuş.",
          registration,
        },
        { status: 200 }
      );
    }

    const updatedRegistration = await prisma.registration.update({
      where: {
        id: registration.id,
      },
      data: {
        status: "ATTENDED",
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        event: {
          select: {
            title: true,
            location: true,
            eventDate: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Check-in başarılı. Katılım onaylandı.",
      registration: updatedRegistration,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    return NextResponse.json(
      { message: "Check-in sırasında hata oluştu." },
      { status: 500 }
    );
  }
}