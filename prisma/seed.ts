import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.registration.deleteMany();
  await prisma.adminRequest.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const superAdmin = await prisma.user.create({
    data: {
      fullName: "Super Admin",
      email: "super@example.com",
      password: hashPassword("123456"),
      role: "SUPER_ADMIN",
    },
  });

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Kullanıcı",
      email: "admin@example.com",
      password: hashPassword("123456"),
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      fullName: "Normal Kullanıcı",
      email: "user@example.com",
      password: hashPassword("123456"),
      role: "USER",
    },
  });

  const pendingUser = await prisma.user.create({
    data: {
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      password: hashPassword("123456"),
      role: "USER",
    },
  });

  await prisma.adminRequest.create({
    data: {
      organizationName: "Yazılım Kulübü",
      reason: "Kulüp etkinliklerini sistem üzerinden yönetmek istiyorum.",
      userId: pendingUser.id,
    },
  });

  const event1 = await prisma.event.create({
    data: {
      title: "React Workshop",
      description: "React temellerinin anlatılacağı uygulamalı etkinlik.",
      location: "Bilgisayar Laboratuvarı",
      eventDate: new Date("2026-07-15T14:00:00"),
      capacity: 40,
      createdById: admin.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Next.js Eğitimi",
      description: "Next.js ile modern web uygulaması geliştirme etkinliği.",
      location: "Konferans Salonu",
      eventDate: new Date("2026-07-18T13:00:00"),
      capacity: 60,
      createdById: admin.id,
    },
  });

  await prisma.registration.create({
    data: {
      qrCode: "EVP-DEMO-QR-12345",
      userId: user.id,
      eventId: event1.id,
    },
  });

  await prisma.registration.create({
    data: {
      qrCode: "EVP-DEMO-QR-67890",
      status: "ATTENDED",
      userId: user.id,
      eventId: event2.id,
    },
  });

  console.log("Seed tamamlandı.");
  console.log("Super Admin:", superAdmin.email);
  console.log("Admin:", admin.email);
  console.log("User:", user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });