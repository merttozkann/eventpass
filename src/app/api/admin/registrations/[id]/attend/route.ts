import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const registrationId = Number(id);

    if (Number.isNaN(registrationId)) {
      return NextResponse.json(
        { message: "Geçersiz kayıt id değeri." },
        { status: 400 }
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