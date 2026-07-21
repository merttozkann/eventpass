import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { hashPassword } from "../../../../lib/password";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      password,
      accountType,
      organizationName,
      adminReason,
    } = body;

    if (!fullName || !email || !password || !accountType) {
      return NextResponse.json(
        { message: "Zorunlu alanlar eksik." },
        { status: 400 }
      );
    }

    if (accountType !== "user" && accountType !== "admin") {
      return NextResponse.json(
        { message: "Geçersiz hesap türü." },
        { status: 400 }
      );
    }

    if (accountType === "admin" && (!organizationName || !adminReason)) {
      return NextResponse.json(
        { message: "Admin başvurusu için kurum ve başvuru nedeni zorunludur." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta zaten kayıtlı." },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    if (accountType === "admin") {
      await prisma.adminRequest.create({
        data: {
          organizationName,
          reason: adminReason,
          userId: newUser.id,
        },
      });

      return NextResponse.json(
        {
          message:
            "Admin başvurun alındı. Super Admin onayladıktan sonra admin olabilirsin.",
          user: newUser,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: "Kayıt başarılı.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { message: "Kayıt sırasında hata oluştu." },
      { status: 500 }
    );
  }
}