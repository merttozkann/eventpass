"use client";

import { Alert, Card, Spin } from "antd";
import { useEffect, useState } from "react";
import RoleGuard from "../../components/RoleGuard";
import MyTicketsList from "../../components/MyTicketsList";
import type { TicketRow } from "../../components/MyTicketsList";

type TicketApiRow = {
  id: number;
  qrCode: string;
  status: "NOT_ATTENDED" | "ATTENDED";
  event: {
    title: string;
    location: string;
    eventDate: string;
  };
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

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const userId = localStorage.getItem("eventpass-user-id");

        if (!userId) {
          setErrorMessage("Kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
          return;
        }

        const response = await fetch(`/api/my-tickets?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || "Biletler alınamadı.");
          return;
        }

        const mappedTickets: TicketRow[] = data.tickets.map(
          (ticket: TicketApiRow) => ({
            id: ticket.id,
            qrCode: ticket.qrCode,
            status: ticket.status,
            eventTitle: ticket.event.title,
            eventLocation: ticket.event.location,
            eventDate: formatDate(ticket.event.eventDate),
          })
        );

        setTickets(mappedTickets);
      } catch (error) {
        console.error("Fetch tickets page error:", error);
        setErrorMessage("Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  return (
    <RoleGuard allowedRoles={["user", "admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "48px 24px",
        }}
      >
        <section style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Card style={{ borderRadius: 16 }}>
            <div style={{ marginBottom: 32 }}>
              <h1
                style={{
                  fontSize: 34,
                  marginBottom: 8,
                  color: "var(--app-text)",
                }}
              >
                Biletlerim
              </h1>

              <p style={{ color: "var(--app-muted)", margin: 0 }}>
                Katıldığın etkinliklerin QR kodlu biletlerini buradan
                görebilirsin.
              </p>
            </div>

            {loading && <Spin size="large" />}

            {!loading && errorMessage && (
              <Alert type="error" showIcon message={errorMessage} />
            )}

            {!loading && !errorMessage && <MyTicketsList tickets={tickets} />}
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}