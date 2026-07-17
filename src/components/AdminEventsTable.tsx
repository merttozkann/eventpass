"use client";

import { Button, Popconfirm, Space, Table, Tag, message } from "antd";
import type { TableProps } from "antd";
import Link from "next/link";
import { useState } from "react";

export type AdminEventRow = {
  id: number;
  title: string;
  location: string;
  eventDate: string;
  capacity: number;
  registrationCount: number;
};

type AdminEventsTableProps = {
  initialEvents: AdminEventRow[];
};

export default function AdminEventsTable({
  initialEvents,
}: AdminEventsTableProps) {
  const [adminEvents, setAdminEvents] =
    useState<AdminEventRow[]>(initialEvents);

  const handleDelete = (id: number) => {
    const filteredEvents = adminEvents.filter((event) => event.id !== id);

    setAdminEvents(filteredEvents);
    message.success("Etkinlik ekrandan silindi. Veritabanı silme işlemini sonra bağlayacağız.");
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
      render: (capacity: number) => <Tag color="blue">{capacity} kişi</Tag>,
    },
    {
      title: "Kayıt Sayısı",
      dataIndex: "registrationCount",
      key: "registrationCount",
      render: (count: number) => <Tag color="purple">{count} kişi</Tag>,
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
            description="Şimdilik sadece ekrandan siler. Veritabanı silme işlemini sonra yapacağız."
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
    <Table
      columns={columns}
      dataSource={adminEvents}
      rowKey="id"
      pagination={false}
      scroll={{ x: 900 }}
    />
  );
}