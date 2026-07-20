"use client";

import { Alert, Button, Card, Spin } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import RoleGuard from "../../../components/RoleGuard";
import AdminEventsTable from "../../../components/AdminEventsTable";
import type { AdminEventRow } from "../../../components/AdminEventsTable";

type AdminEventApiRow = {
  id: number;
  title: string;
  location: string;
  eventDate: string;
  capacity: number;
  _count: {
    registrations: number;
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

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const userId = localStorage.getItem("eventpass-user-id");

        if (!userId) {
          setErrorMessage("Admin kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
          return;
        }

        const response = await fetch(`/api/admin/events?createdById=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || "Etkinlikler alınamadı.");
          return;
        }

        const mappedEvents: AdminEventRow[] = data.events.map(
          (event: AdminEventApiRow) => ({
            id: event.id,
            title: event.title,
            location: event.location,
            eventDate: formatDate(event.eventDate),
            capacity: event.capacity,
            registrationCount: event._count.registrations,
          })
        );

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Admin events page error:", error);
        setErrorMessage("Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "48px 24px",
        }}
      >
        <section style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Card style={{ borderRadius: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 34,
                    marginBottom: 8,
                    color: "var(--app-text)",
                  }}
                >
                  Etkinliklerim
                </h1>

                <p style={{ color: "var(--app-muted)", margin: 0 }}>
                  Sadece senin oluşturduğun etkinlikler burada görünür.
                </p>
              </div>

              <Link href="/admin/events/new">
                <Button type="primary">Yeni Etkinlik</Button>
              </Link>
            </div>

            {loading && <Spin size="large" />}

            {!loading && errorMessage && (
              <Alert type="error" showIcon message={errorMessage} />
            )}

            {!loading && !errorMessage && (
              <AdminEventsTable initialEvents={events} />
            )}
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}