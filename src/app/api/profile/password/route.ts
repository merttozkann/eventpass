import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { hashPassword, verifyPassword } from "../../../../lib/password";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { userId, currentPassword, newPassword } = body;

    const parsedUserId = Number(userId);

    if (Number.isNaN(parsedUserId)) {
      return NextResponse.json(
        { message: "Kullanıcı bilgisi bulunamadı." },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Mevcut şifre ve yeni şifre zorunludur." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Yeni şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parsedUserId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const isCurrentPasswordValid = verifyPassword(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "Mevcut şifre hatalı." },
        { status: 401 }
      );
    }

    const hashedNewPassword = hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: parsedUserId,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return NextResponse.json({
      message: "Şifre başarıyla değiştirildi.",
    });
  } catch (error) {
    console.error("Password update error:", error);

    return NextResponse.json(
      { message: "Şifre değiştirilirken hata oluştu." },
      { status: 500 }
    );
  }
}