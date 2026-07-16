"use client";

import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import Link from "next/link";
import { events } from "../../data/events";

const { Title, Paragraph, Text } = Typography;

export default function EventsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--app-bg)",
        padding: "32px 24px", // üst altta 32 pixel boşluk, yanlarda 24 pixel boşluk bırakır.
      }}
    >
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 32px",
          textAlign: "center",
        }}
      >
        <Title level={1}>Etkinlikler</Title>
        <Paragraph type="secondary">
          Katılmak istediğin etkinliği seç ve QR kodlu biletini oluştur.
        </Paragraph>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          {events.map((event) => (
            <Col xs={24} md={12} lg={8} key={event.id}>
              <Card
                title={event.title}
                style={{ height: "100%" }}
                actions={[
                  <Link href={`/events/${event.id}`} key="detail">
                    <Button type="primary">Detayları Gör</Button>
                  </Link>,
                ]}
              >
                <Paragraph>{event.description}</Paragraph>

                <Space orientation="vertical" size="small">
                  <Text>📍 {event.location}</Text>
                  <Text>📅 {event.date}</Text>
                  <Text>
                    👥 Kapasite: <Tag color="blue">{event.capacity}</Tag>
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </main>
  );
}