import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

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
    const createdById = Number(url.searchParams.get("createdById"));

    if (Number.isNaN(eventId) || Number.isNaN(createdById)) {
      return NextResponse.json(
        { message: "Geçersiz etkinlik veya admin id değeri." },
        { status: 400 }
      );
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        id: createdById,
      },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Sadece admin kullanıcılar bu sayfayı görebilir." },
        { status: 403 }
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        registrations: {
          orderBy: {
            id: "asc",
          },
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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

    if (event.createdById !== createdById) {
      return NextResponse.json(
        { message: "Bu etkinlik sana ait değil." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      event,
      participants: event.registrations,
    });
  } catch (error) {
    console.error("Admin participants error:", error);

    return NextResponse.json(
      { message: "Katılımcılar alınırken hata oluştu." },
      { status: 500 }
    );
  }
}