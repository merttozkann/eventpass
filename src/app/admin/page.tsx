"use client";

import { Button, Card, Col, Row, Statistic } from "antd";
import Link from "next/link";
import RoleGuard from "../../components/RoleGuard";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
    <main
      style={{
        minHeight: "100vh",
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
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>Admin Paneli</h1>

        <p style={{ color: "var(--app-muted)", fontSize: 16 }}>
          Etkinlikleri yönetebilir, katılımcıları görebilir ve QR doğrulama
          yapabilirsin.
        </p>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto 32px" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic title="Toplam Etkinlik" value={3} />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card>
              <Statistic title="Toplam Kayıt" value={128} />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card>
              <Statistic title="Katılım Onayı" value={74} />
            </Card>
          </Col>
        </Row>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card
              title="Yeni Etkinlik Oluştur"
              style={{ height: "100%" }}
              actions={[
                <Link href="/admin/events/new" key="new-event">
                  <Button type="primary">Oluştur</Button>
                </Link>,
              ]}
            >
              <p>
                Etkinlik adı, açıklama, konum, tarih ve kapasite bilgilerini
                girerek yeni etkinlik oluştur.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title="Etkinliklerimi Yönet"
              style={{ height: "100%" }}
              actions={[
                <Link href="/admin/events" key="manage-events">
                  <Button type="primary">Yönet</Button>
                </Link>,
              ]}
            >
              <p>
                Oluşturduğun etkinlikleri listele, düzenle veya sil.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title="QR Kod Doğrula"
              style={{ height: "100%" }}
              actions={[
                <Link href="/admin/check-in" key="check-in">
                  <Button type="primary">Doğrula</Button>
                </Link>,
              ]}
            >
              <p>
                Katılımcının QR kodunu kamera ile okut ve katılım durumunu
                onayla.
              </p>
            </Card>
          </Col>
        </Row>
      </section>
    </main>
    </RoleGuard>
  );
}