import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const requestId = Number(id);

    if (Number.isNaN(requestId)) {
      return NextResponse.json(
        { message: "Geçersiz başvuru id değeri." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { message: "Geçersiz işlem." },
        { status: 400 }
      );
    }

    const adminRequest = await prisma.adminRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        user: true,
      },
    });

    if (!adminRequest) {
      return NextResponse.json(
        { message: "Admin başvurusu bulunamadı." },
        { status: 404 }
      );
    }

    if (adminRequest.status !== "PENDING") {
      return NextResponse.json(
        { message: "Bu başvuru zaten sonuçlandırılmış." },
        { status: 400 }
      );
    }

    if (action === "approve") {
      await prisma.$transaction([
        prisma.adminRequest.update({
          where: {
            id: requestId,
          },
          data: {
            status: "APPROVED",
          },
        }),
        prisma.user.update({
          where: {
            id: adminRequest.userId,
          },
          data: {
            role: "ADMIN",
          },
        }),
      ]);

      return NextResponse.json({
        message: "Admin başvurusu onaylandı.",
      });
    }

    await prisma.adminRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "REJECTED",
      },
    });

    return NextResponse.json({
      message: "Admin başvurusu reddedildi.",
    });
  } catch (error) {
    console.error("Admin request action error:", error);

    return NextResponse.json(
      { message: "Başvuru güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}