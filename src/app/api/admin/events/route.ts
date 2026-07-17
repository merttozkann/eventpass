import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, description, location, eventDate, capacity } = body;

    if (!title || !description || !location || !eventDate || !capacity) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    const adminUser = await prisma.user.findFirst({
      where: {
        email: "admin@example.com",
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { message: "Admin kullanıcı bulunamadı." },
        { status: 404 }
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