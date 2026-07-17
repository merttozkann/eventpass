import { Button, Card } from "antd";
import Link from "next/link";
import RoleGuard from "../../../components/RoleGuard";
import AdminEventsTable from "../../../components/AdminEventsTable";
import type { AdminEventRow } from "../../../components/AdminEventsTable";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      eventDate: "asc",
    },
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  });

  const eventRows: AdminEventRow[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    location: event.location,
    eventDate: formatDate(event.eventDate),
    capacity: event.capacity,
    registrationCount: event._count.registrations,
  }));

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "32px 24px",
        }}
      >
        <section style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Card style={{ borderRadius: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <Link href="/admin">← Admin paneline dön</Link>

                <h1
                  style={{
                    fontSize: 30,
                    marginTop: 16,
                    marginBottom: 8,
                    color: "var(--app-text)",
                  }}
                >
                  Etkinliklerimi Yönet
                </h1>

                <p style={{ color: "var(--app-muted)", margin: 0 }}>
                  Oluşturduğun etkinlikleri buradan listeleyebilir ve
                  yönetebilirsin.
                </p>
              </div>

              <Link href="/admin/events/new">
                <Button type="primary">Yeni Etkinlik Oluştur</Button>
              </Link>
            </div>

            <AdminEventsTable initialEvents={eventRows} />
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}