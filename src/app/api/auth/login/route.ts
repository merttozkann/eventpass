import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

function convertRole(role: "USER" | "ADMIN" | "SUPER_ADMIN") {
  if (role === "ADMIN") {
    return "admin";
  }

  if (role === "SUPER_ADMIN") {
    return "super_admin";
  }

  return "user";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Bu e-posta ile kayıtlı kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { message: "Şifre hatalı." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Giriş başarılı.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: convertRole(user.role),
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Giriş sırasında hata oluştu." },
      { status: 500 }
    );
  }
}