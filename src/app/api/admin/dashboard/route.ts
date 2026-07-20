import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const createdById = Number(url.searchParams.get("createdById"));

    if (Number.isNaN(createdById)) {
      return NextResponse.json(
        { message: "Admin kullanıcı bilgisi bulunamadı." },
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
        { message: "Sadece admin kullanıcılar bu verileri görebilir." },
        { status: 403 }
      );
    }

    const totalEvents = await prisma.event.count({
      where: {
        createdById,
      },
    });

    const upcomingEvents = await prisma.event.count({
      where: {
        createdById,
        eventDate: {
          gte: new Date(),
        },
      },
    });

    const totalRegistrations = await prisma.registration.count({
      where: {
        event: {
          createdById,
        },
      },
    });

    const attendedCount = await prisma.registration.count({
      where: {
        status: "ATTENDED",
        event: {
          createdById,
        },
      },
    });

    const notAttendedCount = await prisma.registration.count({
      where: {
        status: "NOT_ATTENDED",
        event: {
          createdById,
        },
      },
    });

    return NextResponse.json({
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      attendedCount,
      notAttendedCount,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return NextResponse.json(
      { message: "Admin panel verileri alınırken hata oluştu." },
      { status: 500 }
    );
  }
}