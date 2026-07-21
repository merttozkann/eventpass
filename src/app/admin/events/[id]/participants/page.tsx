"use client";

import { Alert, Button, Card, Result, Spin } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RoleGuard from "../../../../../components/RoleGuard";
import AdminParticipantsTable from "../../../../../components/AdminParticipantsTable";
import type { ParticipantRow } from "../../../../../components/AdminParticipantsTable";

type ParticipantApiRow = {
  id: number;
  qrCode: string;
  status: "NOT_ATTENDED" | "ATTENDED";
  user: {
    fullName: string;
    email: string;
  };
};

type EventApiResponse = {
  event?: {
    id: number;
    title: string;
  };
  participants?: ParticipantApiRow[];
  message?: string;
};

export default function EventParticipantsPage() {
  const params = useParams();
  const eventId = String(params.id);

  const [eventTitle, setEventTitle] = useState("");
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const userId = localStorage.getItem("eventpass-user-id");

        if (!userId) {
          setErrorMessage("Admin kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
          return;
        }

        const response = await fetch(
          `/api/admin/events/${eventId}/participants?createdById=${userId}`
        );

        const data: EventApiResponse = await response.json();

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          setErrorMessage(data.message || "Katılımcılar alınamadı.");
          return;
        }

        setEventTitle(data.event?.title || "");

        const mappedParticipants: ParticipantRow[] =
          data.participants?.map((registration) => ({
            id: registration.id,
            fullName: registration.user.fullName,
            email: registration.user.email,
            qrCode: registration.qrCode,
            status: registration.status,
          })) || [];

        setParticipants(mappedParticipants);
      } catch (error) {
        console.error("Participants page error:", error);
        setErrorMessage("Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchParticipants();
  }, [eventId]);

  if (notFound) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <main
          style={{
            minHeight: "calc(100vh - 68px)",
            backgroundColor: "var(--app-bg)",
            padding: "48px 24px",
          }}
        >
          <Result
            status="404"
            title="Etkinlik bulunamadı"
            subTitle="Katılımcılarını görmek istediğin etkinlik sistemde bulunamadı."
            extra={
              <Link href="/admin/events">
                <Button type="primary">Etkinliklere Dön</Button>
              </Link>
            }
          />
        </main>
      </RoleGuard>
    );
  }

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
            <Link href="/admin/events">← Etkinliklerime dön</Link>

            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <h1
                style={{
                  fontSize: 34,
                  marginBottom: 8,
                  color: "var(--app-text)",
                }}
              >
                Katılımcılar
              </h1>

              <p style={{ color: "var(--app-muted)", marginBottom: 4 }}>
                <strong>Etkinlik:</strong> {eventTitle || "Yükleniyor..."}
              </p>

              <p style={{ color: "var(--app-muted)", margin: 0 }}>
                Bu sayfada etkinliğe kayıt olan kullanıcıları ve katılım
                durumlarını görebilirsin.
              </p>
            </div>

            {loading && <Spin size="large" />}

            {!loading && errorMessage && (
              <Alert type="error" showIcon message={errorMessage} />
            )}

            {!loading && !errorMessage && (
              <AdminParticipantsTable initialParticipants={participants} />
            )}
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}