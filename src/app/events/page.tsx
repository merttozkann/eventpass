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
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
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
          {events.map((event) => {
            const registeredCount = event._count.registrations;
            const remainingCapacity = event.capacity - registeredCount;
            const isFull = remainingCapacity <= 0;

            return (
              <Col xs={24} md={12} lg={8} key={event.id}>
                <Card style={{ borderRadius: 16, height: "100%" }}>
                  <h2 style={{ color: "var(--app-text)" }}>{event.title}</h2>

                  <p style={{ color: "var(--app-muted)" }}>{event.description}</p>

                  <Space orientation="vertical" size="small">
                    <Tag color="blue">Kapasite: {event.capacity}</Tag>

                    <Tag color="purple">Kayıtlı: {registeredCount}</Tag>

                    {isFull ? (
                      <Tag color="red">Etkinlik dolu</Tag>
                    ) : (
                      <Tag color="green">Kalan kontenjan: {remainingCapacity}</Tag>
                    )}
                  </Space>

                  <div style={{ marginTop: 20 }}>
                    <Link href={`/events/${event.id}`}>
                      <Button type="primary">
                        Detayları Gör
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </section>
    </main>
  );
}