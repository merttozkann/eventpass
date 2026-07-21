import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrCode, userId } = body;

    const adminUserId = Number(userId);

    if (!qrCode || typeof qrCode !== "string") {
      return NextResponse.json(
        { message: "QR kod zorunludur." },
        { status: 400 }
      );
    }

    if (Number.isNaN(adminUserId)) {
      return NextResponse.json(
        { message: "Admin kullanıcı bilgisi bulunamadı. Tekrar giriş yap." },
        { status: 400 }
      );
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        id: adminUserId,
      },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Sadece admin kullanıcılar check-in yapabilir." },
        { status: 403 }
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
            id: true,
            title: true,
            location: true,
            eventDate: true,
            createdById: true,
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

    if (registration.event.createdById !== adminUserId) {
      return NextResponse.json(
        { message: "Bu etkinlik sana ait değil." },
        { status: 403 }
      );
    }

    if (registration.status === "ATTENDED") {
      return NextResponse.json({
        message: "Bu bilet zaten daha önce okutulmuş.",
        registration,
      });
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