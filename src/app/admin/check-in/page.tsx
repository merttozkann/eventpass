"use client";

import {
  Alert,
  App as AntdApp,
  Button,
  Card,
  Form,
  Input,
  Result,
  Space,
  Tag,
} from "antd";
import { useState } from "react";
import RoleGuard from "../../../components/RoleGuard";
import QrScanner from "../../../components/QrScanner";

type CheckInResult = {
  id: number;
  qrCode: string;
  status: "NOT_ATTENDED" | "ATTENDED";
  user: {
    fullName: string;
    email: string;
  };
  event: {
    title: string;
    location: string;
    eventDate: string;
  };
};

type CheckInFormValues = {
  qrCode: string;
};

function formatDate(dateText: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateText));
}

export default function CheckInPage() {
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);

  const checkInWithQrCode = async (qrCode: string) => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode: qrCode.trim(),
          userId: localStorage.getItem("eventpass-user-id"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Check-in başarısız.");
        return;
      }

      setResult(data.registration);
      message.success(data.message || "Check-in başarılı.");
    } catch (error) {
      console.error("Check-in page error:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: CheckInFormValues) => {
    await checkInWithQrCode(values.qrCode);
  };

  const handleQrScanSuccess = async (qrCode: string) => {
    await checkInWithQrCode(qrCode);
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "48px 24px",
        }}
      >
        <section style={{ maxWidth: 800, margin: "0 auto" }}>
          <Card style={{ borderRadius: 16 }}>
            <div style={{ marginBottom: 24 }}>
              <h1
                style={{
                  fontSize: 34,
                  marginBottom: 8,
                  color: "var(--app-text)",
                }}
              >
                QR Check-in
              </h1>

              <p style={{ color: "var(--app-muted)", margin: 0 }}>
                Katılımcının biletindeki QR kod değerini girerek veya kamera ile
                okutarak katılımını onaylayabilirsin.
              </p>
            </div>

            <Alert
              type="info"
              showIcon
              title="Manuel giriş veya kamera ile QR okutma"
              description="QR kod değerini elle yazabilir ya da kamerayı kullanarak okutabilirsin."
              style={{ marginBottom: 24 }}
            />

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="QR Kod"
                name="qrCode"
                rules={[{ required: true, message: "QR kod zorunludur." }]}
              >
                <Input placeholder="Örn: EVP-DEMO-QR-12345" />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading}>
                Check-in Yap
              </Button>
            </Form>

            <QrScanner onScanSuccess={handleQrScanSuccess} />

            {result && (
              <div style={{ marginTop: 32 }}>
                <Result
                  status="success"
                  title="Katılımcı doğrulandı"
                  subTitle="Bu bilet sistemde kayıtlı."
                />

                <Card style={{ borderRadius: 16 }}>
                  <Space orientation="vertical" size="middle">
                    <div>
                      <strong>Katılımcı:</strong> {result.user.fullName}
                    </div>

                    <div>
                      <strong>E-posta:</strong> {result.user.email}
                    </div>

                    <div>
                      <strong>Etkinlik:</strong> {result.event.title}
                    </div>

                    <div>
                      <strong>Konum:</strong> {result.event.location}
                    </div>

                    <div>
                      <strong>Tarih:</strong>{" "}
                      {formatDate(result.event.eventDate)}
                    </div>

                    <div>
                      <strong>QR Kod:</strong> {result.qrCode}
                    </div>

                    <div>
                      <strong>Durum:</strong>{" "}
                      <Tag color="green">Katıldı</Tag>
                    </div>
                  </Space>
                </Card>
              </div>
            )}
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}