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

  return (
    <main
      style={{
        minHeight: "calc(100vh - 68px)",
        backgroundColor: "var(--app-bg)",
        padding: "32px 24px",
      }}
    >
      <section style={{ maxWidth: 800, margin: "0 auto" }}>
        <Card style={{ borderRadius: 16 }}>
          <Link href="/events">← Etkinliklere dön</Link>

          <Divider />

          <h1
            style={{
              fontSize: 32,
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

          <Divider />

          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <span>
              <strong>Konum:</strong> {event.location}
            </span>

            <span>
              <strong>Tarih:</strong> {formatDate(event.eventDate)}
            </span>

            <span>
              <strong>Kapasite:</strong>{" "}
              <Tag color="blue">{event.capacity} kişi</Tag>
            </span>

            <span>
              <strong>Kayıtlı kişi:</strong>{" "}
              <Tag color="purple">{registeredCount} kişi</Tag>
            </span>

            <span>
              <strong>Oluşturan admin:</strong> {event.createdBy.fullName}
            </span>
          </Space>

          <Divider />

          <JoinEventButton eventId={event.id} />
        </Card>
      </section>
    </main>
  );
}