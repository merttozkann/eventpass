import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = Number(url.searchParams.get("userId"));

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { message: "Kullanıcı bilgisi bulunamadı." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Profile get error:", error);

    return NextResponse.json(
      { message: "Profil bilgileri alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, fullName } = body;

    const parsedUserId = Number(userId);

    if (Number.isNaN(parsedUserId)) {
      return NextResponse.json(
        { message: "Kullanıcı bilgisi bulunamadı." },
        { status: 400 }
      );
    }

    if (!fullName || typeof fullName !== "string") {
      return NextResponse.json(
        { message: "Ad soyad zorunludur." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: parsedUserId,
      },
      data: {
        fullName,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Profil bilgileri güncellendi.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      { message: "Profil güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}