"use client";

import { App as AntdApp, Button, Popconfirm, Select, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useMemo, useState } from "react";

export type AdminRequestRow = {
    id: number;
    organizationName: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    user: {
        fullName: string;
        email: string;
    };
};

type RequestFilter = "all" | "PENDING" | "APPROVED" | "REJECTED";

type SuperAdminRequestsTableProps = {
    initialRequests: AdminRequestRow[];
};

export default function SuperAdminRequestsTable({
    initialRequests,
}: SuperAdminRequestsTableProps) {
    const { message } = AntdApp.useApp();
    const [requests, setRequests] = useState<AdminRequestRow[]>(initialRequests);
    const [statusFilter, setStatusFilter] =
        useState<RequestFilter>("all");

    const filteredRequests = useMemo(() => {
        if (statusFilter === "all") {
            return requests;
        }

        return requests.filter(
            (request) => request.status === statusFilter
        );
    }, [requests, statusFilter]);

    const handleAction = async (id: number, action: "approve" | "reject") => {
        const response = await fetch(`/api/super-admin/admin-requests/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            message.error(data.message || "İşlem başarısız.");
            return;
        }

        const newStatus: AdminRequestRow["status"] =
            action === "approve" ? "APPROVED" : "REJECTED";

        const updatedRequests: AdminRequestRow[] = requests.map((request) =>
            request.id === id
                ? {
                    ...request,
                    status: newStatus,
                }
                : request
        );

        setRequests(updatedRequests);
        message.success(data.message || "İşlem başarılı.");
    };

    const columns: TableProps<AdminRequestRow>["columns"] = [
        {
            title: "Kullanıcı",
            key: "user",
            render: (_, record) => (
                <div>
                    <strong>{record.user.fullName}</strong>
                    <div style={{ color: "var(--app-muted)", fontSize: 13 }}>
                        {record.user.email}
                    </div>
                </div>
            ),
        },
        {
            title: "Kurum / Kulüp",
            dataIndex: "organizationName",
            key: "organizationName",
        },
        {
            title: "Başvuru Nedeni",
            dataIndex: "reason",
            key: "reason",
        },
        {
            title: "Durum",
            dataIndex: "status",
            key: "status",
            render: (status: AdminRequestRow["status"]) => {
                if (status === "APPROVED") {
                    return <Tag color="green">Onaylandı</Tag>;
                }

                if (status === "REJECTED") {
                    return <Tag color="red">Reddedildi</Tag>;
                }

                return <Tag color="orange">Bekliyor</Tag>;
            },
        },
        {
            title: "İşlem",
            key: "actions",
            render: (_, record) => (
                <Space orientation="horizontal">
                    <Popconfirm
                        title="Admin başvurusunu onayla"
                        description="Bu kullanıcı admin rolüne geçirilecek."
                        okText="Onayla"
                        cancelText="Vazgeç"
                        disabled={record.status !== "PENDING"}
                        onConfirm={() => handleAction(record.id, "approve")}
                    >
                        <Button type="primary" disabled={record.status !== "PENDING"}>
                            Onayla
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title="Admin başvurusunu reddet"
                        description="Bu başvuru reddedilecek."
                        okText="Reddet"
                        cancelText="Vazgeç"
                        disabled={record.status !== "PENDING"}
                        onConfirm={() => handleAction(record.id, "reject")}
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
        <>
            <Space style={{ marginBottom: 20 }}>
                <Select
                    value={statusFilter}
                    style={{ width: 230 }}
                    onChange={(value) => setStatusFilter(value)}
                    options={[
                        {
                            label: "Tüm Başvurular",
                            value: "all",
                        },
                        {
                            label: "Bekleyen",
                            value: "PENDING",
                        },
                        {
                            label: "Onaylanan",
                            value: "APPROVED",
                        },
                        {
                            label: "Reddedilen",
                            value: "REJECTED",
                        },
                    ]}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={filteredRequests}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1000 }}
            />
        </>
    );
}