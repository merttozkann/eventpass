"use client";

import { Alert, Button, Card, Input, Select, Space, Spin } from "antd";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

type AdminEventListItem = AdminEventRow & {
  eventDateRaw: string;
};

type DateFilter = "all" | "upcoming" | "past";

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
  const [events, setEvents] = useState<AdminEventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

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

        const mappedEvents: AdminEventListItem[] = data.events.map(
          (event: AdminEventApiRow) => ({
            id: event.id,
            title: event.title,
            location: event.location,
            eventDate: formatDate(event.eventDate),
            eventDateRaw: event.eventDate,
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

  const filteredEvents = useMemo(() => {
    const normalizedSearchText = searchText
      .trim()
      .toLocaleLowerCase("tr-TR");

    const now = new Date();

    return events.filter((event) => {
      const matchesSearch =
        normalizedSearchText.length === 0 ||
        event.title.toLocaleLowerCase("tr-TR").includes(normalizedSearchText);

      const eventDate = new Date(event.eventDateRaw);

      const matchesDateFilter =
        dateFilter === "all" ||
        (dateFilter === "upcoming" && eventDate >= now) ||
        (dateFilter === "past" && eventDate < now);

      return matchesSearch && matchesDateFilter;
    });
  }, [events, searchText, dateFilter]);

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
              <>
                <Space
                  orientation="horizontal"
                  size="middle"
                  wrap
                  style={{ marginBottom: 24 }}
                >
                  <Input
                    allowClear
                    placeholder="Etkinlik adına göre ara"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    style={{ width: 280 }}
                  />

                  <Select
                    value={dateFilter}
                    onChange={(value) => setDateFilter(value)}
                    style={{ width: 220 }}
                    options={[
                      {
                        label: "Tüm etkinlikler",
                        value: "all",
                      },
                      {
                        label: "Yaklaşan etkinlikler",
                        value: "upcoming",
                      },
                      {
                        label: "Geçmiş etkinlikler",
                        value: "past",
                      },
                    ]}
                  />
                </Space>

                <AdminEventsTable initialEvents={filteredEvents} />
              </>
            )}
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}