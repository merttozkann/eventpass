"use client";

import { Button, Card, Col, Row, Statistic } from "antd";
import Link from "next/link";
import RoleGuard from "../../components/RoleGuard";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "28px 24px",
        }}
      >
        <section
          style={{
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            <h1
              style={{
                fontSize: 38,
                margin: "0 0 8px",
                color: "var(--app-text)",
              }}
            >
              Admin Paneli
            </h1>

            <p
              style={{
                color: "var(--app-muted)",
                fontSize: 16,
                margin: 0,
              }}
            >
              Etkinlikleri yönetebilir, katılımcıları görebilir ve QR doğrulama
              yapabilirsin.
            </p>
          </div>

          <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 14 }}>
                <Statistic title="Toplam Etkinlik" value={3} />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 14 }}>
                <Statistic title="Toplam Kayıt" value={128} />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 14 }}>
                <Statistic title="Katılım Onayı" value={74} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <Card title="Yeni Etkinlik Oluştur" style={{ borderRadius: 14 }}>
                <p>
                  Etkinlik adı, açıklama, konum, tarih ve kapasite bilgilerini
                  girerek yeni etkinlik oluştur.
                </p>

                <Link href="/admin/events/new">
                  <Button type="primary">Oluştur</Button>
                </Link>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card title="Etkinliklerimi Yönet" style={{ borderRadius: 14 }}>
                <p>Oluşturduğun etkinlikleri listele, düzenle veya sil.</p>

                <Link href="/admin/events">
                  <Button type="primary">Yönet</Button>
                </Link>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card title="QR Kod Doğrula" style={{ borderRadius: 14 }}>
                <p>
                  Katılımcının QR kodunu kamera ile okut ve katılım durumunu
                  onayla.
                </p>

                <Link href="/admin/check-in">
                  <Button type="primary">Doğrula</Button>
                </Link>
              </Card>
            </Col>
          </Row>
        </section>
      </main>
    </RoleGuard>
  );
}