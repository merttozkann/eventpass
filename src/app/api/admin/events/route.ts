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

    const events = await prisma.event.findMany({
      where: {
        createdById,
      },
      orderBy: {
        eventDate: "asc",
      },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    return NextResponse.json({
      events,
    });
  } catch (error) {
    console.error("Admin events get error:", error);

    return NextResponse.json(
      { message: "Etkinlikler alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, description, location, eventDate, capacity, userId } = body;

    if (!title || !description || !location || !eventDate || !capacity || !userId) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { message: "Admin kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    if (adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Sadece admin kullanıcılar etkinlik oluşturabilir." },
        { status: 403 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        location,
        eventDate: new Date(eventDate),
        capacity: Number(capacity),
        createdById: adminUser.id,
      },
    });

    return NextResponse.json(
      {
        message: "Etkinlik başarıyla oluşturuldu.",
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);

    return NextResponse.json(
      { message: "Etkinlik oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}