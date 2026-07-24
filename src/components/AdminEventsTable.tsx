"use client";

import {
  App as AntdApp,
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { TableProps } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

export type AdminEventRow = {
  id: number;
  title: string;
  location: string;
  eventDate: string;
  capacity: number;
  registrationCount: number;
  eventDateRaw: string;
};

type AdminEventsTableProps = {
  initialEvents: AdminEventRow[];
};

export default function AdminEventsTable({
  initialEvents,
}: AdminEventsTableProps) {
  const { message } = AntdApp.useApp();
  const [events, setEvents] = useState<AdminEventRow[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const handleDelete = async (id: number) => {
    const userId = localStorage.getItem("eventpass-user-id");

    if (!userId) {
      message.error("Admin kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
      return;
    }

    console.log("Silme isteği userId:", userId);
    console.log("Silinecek event id:", id);

    const response = await fetch(
      `/api/admin/events/${id}?createdById=${userId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      message.error(data.message || "Etkinlik silinemedi.");
      return;
    }

    const updatedEvents = events.filter((event) => event.id !== id);

    setEvents(updatedEvents);
    message.success("Etkinlik silindi.");
  };

  const columns: TableProps<AdminEventRow>["columns"] = [
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
      dataIndex: "eventDate",
      key: "eventDate",
    },
    {
      title: "Kapasite",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity: number) => <Tag>{capacity} kişi</Tag>,
    },
    {
      title: "Kayıt Sayısı",
      dataIndex: "registrationCount",
      key: "registrationCount",
      render: (registrationCount: number) => (
        <Tag color="blue">{registrationCount} kayıt</Tag>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => {
        const isPastEvent = new Date(record.eventDateRaw) < new Date();

        return (
          <Space orientation="horizontal">
            <Link href={`/events/${record.id}`}>
              <Button>Detay</Button>
            </Link>

            <Link href={`/admin/events/${record.id}/participants`}>
              <Button>Katılımcılar</Button>
            </Link>

            <Tooltip
              title={
                isPastEvent
                  ? "Geçmiş etkinlikler düzenlenemez."
                  : ""
              }
            >
              <Link
                href={
                  isPastEvent
                    ? "#"
                    : `/admin/events/${record.id}/edit`
                }
              >
                <Button
                  type="primary"
                  disabled={isPastEvent}
                >
                  Düzenle
                </Button>
              </Link>
            </Tooltip>

            <Popconfirm
              title="Etkinliği sil"
              description="Bu etkinliği silmek istediğine emin misin?"
              okText="Evet"
              cancelText="Vazgeç"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger>Sil</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={events}
      rowKey="id"
      pagination={false}
      scroll={{ x: 1000 }}
    />
  );
}