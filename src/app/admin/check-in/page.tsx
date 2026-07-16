"use client";

import { Alert, Button, Card, Input, Space, Tag, message } from "antd";
import Link from "next/link";
import { useState } from "react";
import { tickets } from "../../../data/tickets";
import type { Ticket } from "../../../data/tickets";
import RoleGuard from "../../../components/RoleGuard";

type CheckResult = {
  status: "success" | "error" | "warning";
  title: string;
  description: string;
};

export default function CheckInPage() {
  const [qrCode, setQrCode] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [ticketList, setTicketList] = useState<Ticket[]>(tickets);

  const handleCheckQr = () => {
    if (!qrCode.trim()) {
      message.warning("Lütfen QR kod değerini giriniz.");
      return;
    }

    const ticket = ticketList.find(
      (item) => item.qrCode === qrCode.trim()
    );

    if (!ticket) {
      setResult({
        status: "error",
        title: "Geçersiz QR kod",
        description:
          "Bu QR kod sistemde kayıtlı değil veya bu etkinliğe ait değil.",
      });

      return;
    }

    if (ticket.status === "Katıldı") {
      setResult({
        status: "warning",
        title: "QR kod daha önce kullanılmış",
        description: `${ticket.fullName} adlı katılımcının ${ticket.eventTitle} etkinliği için katılımı daha önce onaylanmış.`,
      });

      return;
    }

    const updatedTickets = ticketList.map((item) =>
      item.id === ticket.id ? { ...item, status: "Katıldı" as const } : item
    );

    setTicketList(updatedTickets);

    setResult({
      status: "success",
      title: "Katılım onaylandı",
      description: `${ticket.fullName} adlı katılımcının ${ticket.eventTitle} etkinliği için katılımı başarıyla onaylandı.`,
    });
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--app-bg)",
        padding: "32px 24px",
      }}
    >
      <section style={{ maxWidth: 750, margin: "0 auto" }}>
        <Card>
          <Link href="/admin">← Admin paneline dön</Link>

          <h1 style={{ fontSize: 30, marginTop: 24, marginBottom: 8 }}>
            QR Kod Doğrula
          </h1>

          <p style={{ color: "var(--app-muted)", marginBottom: 24 }}>
            Katılımcının QR kodunu girerek etkinlik katılımını kontrol
            edebilirsin.
          </p>

          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <Input
              size="large"
              placeholder="Örn: EVP-DEMO-QR-12345"
              value={qrCode}
              onChange={(event) => setQrCode(event.target.value)}
            />

            <Button type="primary" size="large" block onClick={handleCheckQr}>
              QR Kodu Kontrol Et
            </Button>

            {result && (
              <Alert
                type={result.status}
                title={result.title}
                description={result.description}
                showIcon
              />
            )}

            <Card size="small" title="Deneme QR Kodları">
              <Space orientation="vertical">
                <span>
                  Geçerli QR: <Tag color="green">EVP-DEMO-QR-12345</Tag>
                </span>

                <span>
                  Daha önce okutulmuş QR:{" "}
                  <Tag color="orange">EVP-DEMO-QR-67890</Tag>
                </span>

                <span>Geçersiz QR için rastgele bir şey yazabilirsin.</span>
              </Space>
            </Card>
          </Space>
        </Card>
      </section>
    </main>
    </RoleGuard>
  );
}