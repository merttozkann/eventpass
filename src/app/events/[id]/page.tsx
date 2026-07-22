import { Card, Divider, Space, Tag } from "antd";
import Link from "next/link";
import { notFound } from "next/navigation";
import JoinEventButton from "../../../components/JoinEventButton";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      createdBy: {
        select: {
          fullName: true,
          email: true,
        },
      },
      registrations: true,
    },
  });

  if (!event) {
    notFound();
  }

  const registeredCount = event.registrations.length;
  const remainingCapacity = event.capacity - registeredCount;
  const isFull = remainingCapacity <= 0;

  return (
    <main
      style={{
        minHeight: "calc(100vh - 68px)",
        backgroundColor: "var(--app-bg)",
        padding: "48px 24px",
      }}
    >
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <Card style={{ borderRadius: 16 }}>
          <Link href="/events">← Etkinliklere dön</Link>

          <div style={{ marginTop: 24 }}>
            <h1
              style={{
                fontSize: 38,
                marginBottom: 12,
                color: "var(--app-text)",
              }}
            >
              {event.title}
            </h1>

            <p
              style={{
                color: "var(--app-muted)",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              {event.description}
            </p>
          </div>

          <Divider />

          <Space orientation="vertical" size="middle">
            <div>
              <strong>Konum:</strong> {event.location}
            </div>

            <div>
              <strong>Tarih:</strong> {formatDate(event.eventDate)}
            </div>

            <div>
              <strong>Oluşturan Admin:</strong> {event.createdBy.fullName}
            </div>

            <Space orientation="vertical" size="small">
              <Tag color="blue">Kapasite: {event.capacity}</Tag>

              <Tag color="purple">Kayıtlı: {registeredCount}</Tag>

              {isFull ? (
                <Tag color="red">Etkinlik dolu</Tag>
              ) : (
                <Tag color="green">
                  Kalan kontenjan: {remainingCapacity}
                </Tag>
              )}
            </Space>
          </Space>

          <Divider />
              
          <JoinEventButton eventId={event.id} isFull={isFull} />
        </Card>
      </section>
    </main>
  );
}