"use client";

import { Button, Card, Popconfirm, Space, Table, Tag, message } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import { adminRequests } from "../../data/adminRequests";
import RoleGuard from "../../components/RoleGuard";
import type {
  AdminRequest,
  AdminRequestStatus,
} from "../../data/adminRequests";

export default function SuperAdminPage() {
  const [requests, setRequests] = useState<AdminRequest[]>(adminRequests);

  const getStatusTag = (status: AdminRequestStatus) => {
    if (status === "PENDING") {
      return <Tag color="orange">Bekliyor</Tag>;
    }

    if (status === "APPROVED") {
      return <Tag color="green">Onaylandı</Tag>;
    }

    return <Tag color="red">Reddedildi</Tag>;
  };

  const handleApprove = (id: number) => {
    const updatedRequests = requests.map((request) =>
      request.id === id ? { ...request, status: "APPROVED" as const } : request
    );

    setRequests(updatedRequests);
    message.success("Admin başvurusu onaylandı.");
  };

  const handleReject = (id: number) => {
    const updatedRequests = requests.map((request) =>
      request.id === id ? { ...request, status: "REJECTED" as const } : request
    );

    setRequests(updatedRequests);
    message.success("Admin başvurusu reddedildi.");
  };

  const columns: TableProps<AdminRequest>["columns"] = [
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
      title: "Kurum / Kulüp",
      dataIndex: "organizationName",
      key: "organizationName",
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status: AdminRequestStatus) => getStatusTag(status),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Başvuru onaylansın mı?"
            description="Bu kullanıcı admin yetkisi alacak."
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => handleApprove(record.id)}
            disabled={record.status !== "PENDING"}
          >
            <Button type="primary" disabled={record.status !== "PENDING"}>
              Onayla
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Başvuru reddedilsin mi?"
            description="Bu kullanıcı admin yetkisi alamayacak."
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => handleReject(record.id)}
            disabled={record.status !== "PENDING"}
          >
            <Button danger disabled={record.status !== "PENDING"}>
              Reddet
            </Button>
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
      <section style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Card>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>
            Super Admin Paneli
          </h1>

          <p style={{ color: "var(--app-muted)", marginBottom: 24 }}>
            Admin başvurularını buradan görüntüleyebilir, onaylayabilir veya
            reddedebilirsin.
          </p>

          <Table
            columns={columns}
            dataSource={requests}
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                  <strong>Başvuru nedeni:</strong> {record.reason}
                </p>
              ),
            }}
          />
        </Card>
      </section>
    </main>
    </RoleGuard>
  );
}