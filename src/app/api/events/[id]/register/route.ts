import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const eventId = Number(id);

    const body = await request.json();
    const userId = Number(body.userId);

    if (Number.isNaN(eventId)) {
      return NextResponse.json(
        { message: "Geçersiz etkinlik id değeri." },
        { status: 400 }
      );
    }

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { message: "Kullanıcı bilgisi bulunamadı. Tekrar giriş yap." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Etkinlik bulunamadı." },
        { status: 404 }
      );
    }

    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId: user.id,
        eventId: event.id,
      },
    });

    if (existingRegistration) {
      return NextResponse.json({
        message: "Bu etkinliğe zaten kayıtlısın.",
        registration: existingRegistration,
      });
    }

    if (event._count.registrations >= event.capacity) {
      return NextResponse.json(
        { message: "Etkinlik kapasitesi dolu." },
        { status: 400 }
      );
    }

    const qrCode = `EVP-${event.id}-${user.id}-${Date.now()}`;

    const registration = await prisma.registration.create({
      data: {
        qrCode,
        userId: user.id,
        eventId: event.id,
      },
    });

    return NextResponse.json(
      {
        message: "Etkinliğe başarıyla kayıt oldun.",
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register event error:", error);

    return NextResponse.json(
      { message: "Etkinliğe kayıt olurken hata oluştu." },
      { status: 500 }
    );
  }
}