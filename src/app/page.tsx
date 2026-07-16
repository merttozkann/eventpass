"use client";

import { Button, Card, Col, Row, Space, Tag } from "antd";
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--app-bg)",
        padding: "48px 24px",
      }}
    >
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Tag color="blue" style={{ marginBottom: 16 }}>
          QR Kodlu Etkinlik Katılım Sistemi
        </Tag>

        <h1
          style={{
            fontSize: 44,
            marginBottom: 16,
            color: "var(--app-text)",
          }}
        >
          EventPass
        </h1>

        <p
          style={{
            maxWidth: 680,
            margin: "0 auto 32px",
            fontSize: 18,
            color: "var(--app-muted)",
            lineHeight: 1.6,
          }}
        >
          Etkinliklere kolayca kayıt ol, sana özel QR kodlu biletini oluştur ve
          etkinlik günü QR kod ile hızlı katılım sağla.
        </p>

        <Space size="middle" wrap>
          <Link href="/events">
            <Button type="primary" size="large">
              Etkinlikleri Gör
            </Button>
          </Link>

          <Link href="/register">
            <Button size="large">Kayıt Ol</Button>
          </Link>
        </Space>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: "48px auto 0",
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card title="Etkinlikleri Keşfet" style={{ height: "100%" }}>
              <p>
                Yayındaki etkinlikleri görüntüleyebilir, detaylarını inceleyebilir
                ve katılmak istediğin etkinliği seçebilirsin.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="QR Biletini Al" style={{ height: "100%" }}>
              <p>
                Etkinliğe kayıt olduktan sonra sana özel QR kodlu bilet
                oluşturulur. Bu bileti etkinlik girişinde kullanırsın.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="Hızlı Katılım" style={{ height: "100%" }}>
              <p>
                Etkinlik günü görevli kişi QR kodunu okutarak katılımını hızlıca
                onaylar.
              </p>
            </Card>
          </Col>
        </Row>
      </section>
    </main>
  );
}