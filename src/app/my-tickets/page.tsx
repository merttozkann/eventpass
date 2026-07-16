"use client";

import { Button, Card, Col, QRCode, Row, Space, Tag } from "antd";
import Link from "next/link";
import { tickets } from "../../data/tickets";
import RoleGuard from "../../components/RoleGuard";

export default function MyTicketsPage() {
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
          maxWidth: 1000,
          margin: "0 auto 32px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>QR Biletlerim</h1>

        <p style={{ color: "var(--app-muted)", fontSize: 16 }}>
          Kayıt olduğun etkinlikleri ve QR kodlu biletlerini buradan
          görebilirsin.
        </p>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          {tickets.map((ticket) => (
            <Col xs={24} key={ticket.id}>
              <Card>
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={16}>
                    <h2 style={{ fontSize: 26, marginBottom: 16 }}>
                      {ticket.eventTitle}
                    </h2>

                    <Space orientation="vertical" size="middle">
                      <span>👤 {ticket.fullName}</span>
                      <span>📍 {ticket.location}</span>
                      <span>📅 {ticket.date}</span>
                      <span>
                        Durum:{" "}
                        <Tag
                          color={
                            ticket.status === "Katıldı" ? "green" : "orange"
                          }
                        >
                          {ticket.status}
                        </Tag>
                      </span>
                    </Space>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ textAlign: "center" }}>
                      <QRCode value={ticket.qrCode} size={160} />

                      <p
                        style={{
                          marginTop: 12,
                          color: "var(--app-muted)",
                          wordBreak: "break-all",
                        }}
                      >
                        {ticket.qrCode}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <div
        style={{
          maxWidth: 1000,
          margin: "24px auto 0",
          textAlign: "center",
        }}
      >
        <Link href="/events">
          <Button type="primary">Etkinliklere Dön</Button>
        </Link>
      </div>
    </main>
    </RoleGuard>
  );
}