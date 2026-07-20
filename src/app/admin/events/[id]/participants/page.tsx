import { Button, Card, Result } from "antd";
import Link from "next/link";
import RoleGuard from "../../../../../components/RoleGuard";
import AdminParticipantsTable from "../../../../../components/AdminParticipantsTable";
import type { ParticipantRow } from "../../../../../components/AdminParticipantsTable";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EventParticipantsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventParticipantsPage({
  params,
}: EventParticipantsPageProps) {
  const { id } = await params;
  const eventId = Number(id);

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      registrations: {
        orderBy: {
          id: "asc",
        },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!event) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <main
          style={{
            minHeight: "calc(100vh - 68px)",
            backgroundColor: "var(--app-bg)",
            padding: "32px 24px",
          }}
        >
          <Card style={{ maxWidth: 700, margin: "0 auto", borderRadius: 16 }}>
            <Result
              status="404"
              title="Etkinlik bulunamadı"
              subTitle="Bu id değerine sahip bir etkinlik bulunamadı."
              extra={
                <Link href="/admin/events">
                  <Button type="primary">Etkinliklere Dön</Button>
                </Link>
              }
            />
          </Card>
        </main>
      </RoleGuard>
    );
  }

  const participantRows: ParticipantRow[] = event.registrations.map(
    (registration) => ({
      id: registration.id,
      fullName: registration.user.fullName,
      email: registration.user.email,
      qrCode: registration.qrCode,
      status: registration.status,
    })
  );

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
            <Link href="/admin/events">← Etkinliklerime dön</Link>

            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <h1
                style={{
                  fontSize: 30,
                  marginBottom: 8,
                  color: "var(--app-text)",
                }}
              >
                Katılımcılar
              </h1>

              <p style={{ color: "var(--app-muted)", marginBottom: 4 }}>
                <strong>Etkinlik:</strong> {event.title}
              </p>

              <p style={{ color: "var(--app-muted)", margin: 0 }}>
                Bu sayfada etkinliğe kayıt olan kullanıcıları ve katılım
                durumlarını görebilirsin.
              </p>
            </div>

            <AdminParticipantsTable initialParticipants={participantRows} />
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}