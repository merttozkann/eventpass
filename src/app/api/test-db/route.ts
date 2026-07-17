import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json({
    message: "Veritabanı bağlantısı başarılı.",
    users,
  });
}