import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    console.log("Gelen registration id:", id);

    const registrationId = Number(id);

    if (!registrationId || Number.isNaN(registrationId)) {
      return NextResponse.json(
        { message: "Geçersiz kayıt id değeri." },
        { status: 400 }
      );
    }

    const existingRegistration = await prisma.registration.findUnique({
      where: {
        id: registrationId,
      },
    });

    if (!existingRegistration) {
      return NextResponse.json(
        { message: "Kayıt bulunamadı." },
        { status: 404 }
      );
    }

    const updatedRegistration = await prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: "ATTENDED",
      },
    });

    console.log("Güncellenen registration:", updatedRegistration);

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