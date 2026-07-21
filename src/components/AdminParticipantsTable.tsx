"use client";

import { App as AntdApp, Button, QRCode, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";

export type ParticipantRow = {
  id: number;
  fullName: string;
  email: string;
  qrCode: string;
  status: "NOT_ATTENDED" | "ATTENDED";
};

type AdminParticipantsTableProps = {
  initialParticipants: ParticipantRow[];
};

export default function AdminParticipantsTable({
  initialParticipants,
}: AdminParticipantsTableProps) {
  const { message } = AntdApp.useApp();
  const [participants, setParticipants] =
    useState<ParticipantRow[]>(initialParticipants);
  useEffect(() => {
    setParticipants(initialParticipants);
  }, [initialParticipants]);

  const handleMarkAsAttended = async (id: number) => {
    const userId = localStorage.getItem("eventpass-user-id");

    if (!userId) {
      message.error("Admin kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
      return;
    }

    const response = await fetch(`/api/admin/registrations/${id}/attend`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.error(data.message || "Katılım onaylanamadı.");
      return;
    }

    const updatedParticipants = participants.map((participant) =>
      participant.id === id
        ? { ...participant, status: "ATTENDED" as const }
        : participant
    );

    setParticipants(updatedParticipants);
    message.success(data.message || "Katılım onaylandı.");
  };

  const columns: TableProps<ParticipantRow>["columns"] = [
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
          <span style={{ fontSize: 12, color: "var(--app-muted)" }}>
            {qrCode}
          </span>
        </Space>
      ),
    },
    {
      title: "Katılım Durumu",
      dataIndex: "status",
      key: "status",
      render: (status: ParticipantRow["status"]) => (
        <Tag color={status === "ATTENDED" ? "green" : "orange"}>
          {status === "ATTENDED" ? "Katıldı" : "Katılmadı"}
        </Tag>
      ),
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          disabled={record.status === "ATTENDED"}
          onClick={() => handleMarkAsAttended(record.id)}
        >
          Katıldı Yap
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={participants}
      rowKey="id"
      pagination={false}
      scroll={{ x: 900 }}
    />
  );
}