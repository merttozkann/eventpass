"use client";

import { Button, Card, Popconfirm, Space, Table, Tag, message } from "antd";
import type { TableProps } from "antd";
import Link from "next/link";
import { useState } from "react";
import { events } from "../../../data/events";
import type { EventItem } from "../../../data/events";
import RoleGuard from "../../../components/RoleGuard";

export default function AdminEventsPage() {
  const [adminEvents, setAdminEvents] = useState<EventItem[]>(events);

  const handleDelete = (id: number) => {
    const filteredEvents = adminEvents.filter((event) => event.id !== id);

    setAdminEvents(filteredEvents);
    message.success("Etkinlik silindi.");
  };

  const columns: TableProps<EventItem>["columns"] = [
    {
      title: "Etkinlik Adı",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Konum",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Tarih",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Kapasite",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity: number) => <Tag color="blue">{capacity} kişi</Tag>,
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Link href={`/events/${record.id}`}>
            <Button>Detay</Button>
          </Link>

          <Link href={`/admin/events/${record.id}/participants`}>
            <Button type="primary">Katılımcılar</Button>
          </Link>

          <Link href={`/admin/events/${record.id}/edit`}>
          <Button>Düzenle</Button>
          </Link>

          <Popconfirm
            title="Etkinlik silinsin mi?"
            description="Bu işlem şu an sadece ekrandan siler."
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Sil</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--app-bg)",
          padding: "32px 24px",
        }}
      >
        <section style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <Link href="/admin">← Admin paneline dön</Link>

                <h1 style={{ fontSize: 30, marginTop: 16, marginBottom: 8 }}>
                  Etkinliklerimi Yönet
                </h1>

                <p style={{ color: "var(--app-muted)", margin: 0 }}>
                  Oluşturduğun etkinlikleri buradan listeleyebilir ve
                  yönetebilirsin.
                </p>
              </div>

              <Link href="/admin/events/new">
                <Button type="primary">Yeni Etkinlik Oluştur</Button>
              </Link>
            </div>

            <Table
              columns={columns}
              dataSource={adminEvents}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}