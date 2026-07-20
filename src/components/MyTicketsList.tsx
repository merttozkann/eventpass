"use client";

import { Card, Col, Empty, QRCode, Row, Space, Tag } from "antd";

export type TicketRow = {
  id: number;
  qrCode: string;
  status: "NOT_ATTENDED" | "ATTENDED";
  eventTitle: string;
  eventLocation: string;
  eventDate: string;
};

type MyTicketsListProps = {
  tickets: TicketRow[];
};

export default function MyTicketsList({ tickets }: MyTicketsListProps) {
  if (tickets.length === 0) {
    return <Empty description="Henüz biletin yok." />;
  }

  return (
    <Row gutter={[24, 24]}>
      {tickets.map((ticket) => (
        <Col xs={24} md={12} lg={8} key={ticket.id}>
          <Card style={{ borderRadius: 16, height: "100%" }}>
            <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <h2
                  style={{
                    fontSize: 22,
                    marginBottom: 8,
                    color: "var(--app-text)",
                  }}
                >
                  {ticket.eventTitle}
                </h2>

                <p style={{ color: "var(--app-muted)", marginBottom: 4 }}>
                  {ticket.eventLocation}
                </p>

                <p style={{ color: "var(--app-muted)", marginBottom: 0 }}>
                  {ticket.eventDate}
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <QRCode value={ticket.qrCode} size={180} />
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "var(--app-muted)",
                  }}
                >
                  {ticket.qrCode}
                </p>
              </div>

              <Tag color={ticket.status === "ATTENDED" ? "green" : "orange"}>
                {ticket.status === "ATTENDED" ? "Katıldı" : "Katılmadı"}
              </Tag>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
}