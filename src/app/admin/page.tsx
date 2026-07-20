"use client";

import { Alert, Button, Card, Col, Row, Spin, Statistic } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import RoleGuard from "../../components/RoleGuard";

type DashboardStats = {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  attendedCount: number;
  notAttendedCount: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const userId = localStorage.getItem("eventpass-user-id");

        if (!userId) {
          setErrorMessage("Admin kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
          return;
        }

        const response = await fetch(`/api/admin/dashboard?createdById=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || "Panel verileri alınamadı.");
          return;
        }

        setStats(data);
      } catch (error) {
        console.error("Admin dashboard page error:", error);
        setErrorMessage("Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "48px 24px",
        }}
      >
        <section style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 40,
                marginBottom: 8,
                color: "var(--app-text)",
              }}
            >
              Admin Paneli
            </h1>

            <p style={{ color: "var(--app-muted)", fontSize: 16 }}>
              Kendi etkinliklerini, kayıtlarını ve check-in durumlarını buradan
              takip edebilirsin.
            </p>
          </div>

          {loading && (
            <Card style={{ borderRadius: 16, textAlign: "center" }}>
              <Spin size="large" />
            </Card>
          )}

          {!loading && errorMessage && (
            <Alert type="error" showIcon message={errorMessage} />
          )}

          {!loading && !errorMessage && stats && (
            <>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                  <Card style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Toplam Etkinlik"
                      value={stats.totalEvents}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                  <Card style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Yaklaşan Etkinlik"
                      value={stats.upcomingEvents}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                  <Card style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Toplam Kayıt"
                      value={stats.totalRegistrations}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                  <Card style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Katılan"
                      value={stats.attendedCount}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                  <Card style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Katılmayan"
                      value={stats.notAttendedCount}
                    />
                  </Card>
                </Col>
              </Row>

              <Card style={{ borderRadius: 16, marginTop: 32 }}>
                <h2 style={{ marginTop: 0, color: "var(--app-text)" }}>
                  Hızlı İşlemler
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <Link href="/admin/events">
                    <Button type="primary">Etkinliklerim</Button>
                  </Link>

                  <Link href="/admin/events/new">
                    <Button>Yeni Etkinlik Oluştur</Button>
                  </Link>

                  <Link href="/admin/check-in">
                    <Button>QR Check-in</Button>
                  </Link>
                </div>
              </Card>
            </>
          )}
        </section>
      </main>
    </RoleGuard>
  );
}