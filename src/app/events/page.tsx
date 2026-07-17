import { Button, Card, Col, Row, Space, Tag } from "antd";
import Link from "next/link";
import { prisma } from "../../lib/prisma";

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

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      eventDate: "asc",
    },
  });

  return (
    <main
      style={{
        minHeight: "calc(100vh - 68px)",
        backgroundColor: "var(--app-bg)",
        padding: "32px 24px",
      }}
    >
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 32px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 36,
            marginBottom: 8,
            color: "var(--app-text)",
          }}
        >
          Etkinlikler
        </h1>

        <p style={{ color: "var(--app-muted)", fontSize: 16 }}>
          Katılmak istediğin etkinliği seç ve QR kodlu biletini oluştur.
        </p>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          {events.map((event) => (
            <Col xs={24} md={12} lg={8} key={event.id}>
              <Card
                title={event.title}
                style={{ height: "100%", borderRadius: 16 }}
                actions={[
                  <Link href={`/events/${event.id}`} key="detail">
                    <Button type="primary">Detayları Gör</Button>
                  </Link>,
                ]}
              >
                <p style={{ color: "var(--app-muted)", lineHeight: 1.6 }}>
                  {event.description}
                </p>

                <Space orientation="vertical" size="small">
                  <span>📍 {event.location}</span>
                  <span>📅 {formatDate(event.eventDate)}</span>
                  <span>
                    👥 Kapasite: <Tag color="blue">{event.capacity}</Tag>
                  </span>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </main>
  );
}