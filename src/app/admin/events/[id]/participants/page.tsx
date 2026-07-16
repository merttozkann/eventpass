"use client";

import { Button, Card, QRCode, Space, Table, Tag, message, Result } from "antd";
import type { TableProps } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import RoleGuard from "../../../../../components/RoleGuard";
import { events } from "../../../../../data/events";
import { participants } from "../../../../../data/participants";
import type { Participant } from "../../../../../data/participants";

export default function EventParticipantsPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const event = events.find((event) => event.id === eventId);

  const [participantList, setParticipantList] = useState<Participant[]>(
    participants.filter((participant) => participant.eventId === eventId)
  );

  const handleMarkAsJoined = (id: number) => {
    const updatedParticipants = participantList.map((participant) =>
      participant.id === id
        ? { ...participant, status: "Katıldı" as const }
        : participant
    );

    setParticipantList(updatedParticipants);
    message.success("Katılımcı durumu güncellendi.");
  };

  const columns: TableProps<Participant>["columns"] = [
    {
      title: "Ad Soyad",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "E-posta",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "QR Kod",
      dataIndex: "qrCode",
      key: "qrCode",
      render: (qrCode: string) => (
        <Space orientation="vertical" size="small">
          <QRCode value={qrCode} size={80} />
          <span style={{ fontSize: 12, color: "var(--app-muted)"}}>{qrCode}</span>
        </Space>
      ),
    },
    {
      title: "Katılım Durumu",
      dataIndex: "status",
      key: "status",
      render: (status: Participant["status"]) => (
        <Tag color={status === "Katıldı" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          disabled={record.status === "Katıldı"}
          onClick={() => handleMarkAsJoined(record.id)}
        >
          Katıldı Yap
        </Button>
      ),
    },
  ];

  if (!event) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <main
          style={{
            minHeight: "calc(100vh - 68px)",
            backgroundColor: "var(--app-bg)",
            padding: "32px 24px",
          }}
        >
          <Card style={{ maxWidth: 700, margin: "0 auto" }}>
            <Result
              status="404"
              title="Etkinlik bulunamadı"
              subTitle="Bu id değerine sahip bir etkinlik bulunamadı."
              extra={
                <Link href="/admin/events">
                  <Button type="primary">Etkinliklere Dön</Button>
                </Link>
              }
            />
          </Card>
        </main>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "32px 24px",
        }}
      >
        <section style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Card>
            <Link href="/admin/events">← Etkinliklerime dön</Link>

            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <h1 style={{ fontSize: 30, marginBottom: 8 }}>
                Katılımcılar
              </h1>

              <p style={{ color: "var(--app-muted)", marginBottom: 4 }}>
                <strong>Etkinlik:</strong> {event.title}
              </p>

              <p style={{ color: "var(--app-muted)", margin: 0 }}>
                Bu sayfada etkinliğe kayıt olan kullanıcıları ve katılım
                durumlarını görebilirsin.
              </p>
            </div>

            <Table
              columns={columns}
              dataSource={participantList}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}