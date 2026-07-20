import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function checkAdminOwnsEvent(eventId: number, adminUserId: number) {
  const adminUser = await prisma.user.findUnique({
    where: {
      id: adminUserId,
    },
  });

  if (!adminUser || adminUser.role !== "ADMIN") {
    return {
      ok: false,
      status: 403,
      message: "Sadece admin kullanıcılar bu işlemi yapabilir.",
      event: null,
    };
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return {
      ok: false,
      status: 404,
      message: "Etkinlik bulunamadı.",
      event: null,
    };
  }

  if (event.createdById !== adminUserId) {
    return {
      ok: false,
      status: 403,
      message: "Bu etkinlik sana ait değil.",
      event: null,
    };
  }

  return {
    ok: true,
    status: 200,
    message: "Yetkili işlem.",
    event,
  };
}

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

    const result = await checkAdminOwnsEvent(eventId, createdById);

    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json({
      event: result.event,
    });
  } catch (error) {
    console.error("Get event error:", error);

    return NextResponse.json(
      { message: "Etkinlik alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const eventId = Number(id);

    const body = await request.json();
    const { title, description, location, eventDate, capacity, userId } = body;

    const adminUserId = Number(userId);

    if (Number.isNaN(eventId) || Number.isNaN(adminUserId)) {
      return NextResponse.json(
        { message: "Geçersiz etkinlik veya admin id değeri." },
        { status: 400 }
      );
    }

    if (!title || !description || !location || !eventDate || !capacity) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    const result = await checkAdminOwnsEvent(eventId, adminUserId);

    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        description,
        location,
        eventDate: new Date(eventDate),
        capacity: Number(capacity),
      },
    });

    return NextResponse.json({
      message: "Etkinlik başarıyla güncellendi.",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);

    return NextResponse.json(
      { message: "Etkinlik güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
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

    const result = await checkAdminOwnsEvent(eventId, createdById);

    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    await prisma.$transaction([
      prisma.registration.deleteMany({
        where: {
          eventId,
        },
      }),
      prisma.event.delete({
        where: {
          id: eventId,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Etkinlik başarıyla silindi.",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return NextResponse.json(
      { message: "Etkinlik silinirken hata oluştu." },
      { status: 500 }
    );
  }
}