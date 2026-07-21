import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const registrationId = Number(id);

    const body = await request.json().catch(() => ({}));
    const adminUserId = Number(body.userId);

    if (Number.isNaN(registrationId) || Number.isNaN(adminUserId)) {
      return NextResponse.json(
        { message: "Geçersiz kayıt veya admin id değeri." },
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
        { message: "Sadece admin kullanıcılar bu işlemi yapabilir." },
        { status: 403 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: {
        id: registrationId,
      },
      include: {
        event: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Katılımcı kaydı bulunamadı." },
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
        message: "Bu katılımcı zaten katıldı olarak işaretlenmiş.",
        registration,
      });
    }

    const updatedRegistration = await prisma.registration.update({
      where: {
        id: registrationId,
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
      message: "Katılım başarıyla onaylandı.",
      registration: updatedRegistration,
    });
  } catch (error) {
    console.error("Attend registration error:", error);

    return NextResponse.json(
      { message: "Katılım onaylanırken hata oluştu." },
      { status: 500 }
    );
  }
}