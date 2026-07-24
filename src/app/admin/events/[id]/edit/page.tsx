"use client";

import {
  App as AntdApp,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Result,
  Spin,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoleGuard from "../../../../../components/RoleGuard";

const { TextArea } = Input;

type EventDateValue = {
  toISOString: () => string;
};

type EditEventFormValues = {
  title: string;
  description: string;
  location: string;
  eventDate: EventDateValue;
  capacity: number;
};

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = String(params.id);

  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<EditEventFormValues>();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPastEvent, setIsPastEvent] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const userId = localStorage.getItem("eventpass-user-id");

        if (!userId) {
          message.error("Admin kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
          setNotFound(true);
          return;
        }

        const response = await fetch(
          `/api/admin/events/${eventId}?createdById=${userId}`
        );
        const data = await response.json();

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        const eventDate = new Date(data.event.eventDate);

        if (eventDate < new Date()) {
          setIsPastEvent(true);
          return;
        }

        form.setFieldsValue({
          title: data.event.title,
          description: data.event.description,
          location: data.event.location,
          eventDate: dayjs(data.event.eventDate),
          capacity: data.event.capacity,
        });
      } catch (error) {
        console.error("Fetch event error:", error);
        message.error("Etkinlik bilgileri alınamadı.");
      } finally {
        setPageLoading(false);
      }
    }

    fetchEvent();
  }, [eventId, form, message]);

  const onFinish = async (values: EditEventFormValues) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          location: values.location,
          eventDate: values.eventDate.toISOString(),
          capacity: values.capacity,
          userId: localStorage.getItem("eventpass-user-id"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Etkinlik güncellenemedi.");
        return;
      }

      message.success("Etkinlik başarıyla güncellendi.");
      router.push("/admin/events");
    } catch (error) {
      console.error("Update event page error:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <main
          style={{
            minHeight: "calc(100vh - 68px)",
            backgroundColor: "var(--app-bg)",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <Spin size="large" />
        </main>
      </RoleGuard>
    );
  }

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
            subTitle="Düzenlemek istediğin etkinlik sistemde bulunamadı."
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

  if (isPastEvent) {
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
            status="403"
            title="Geçmiş etkinlik düzenlenemez"
            subTitle="Etkinlik tarihi geçtiği için düzenleme yapılamaz."
            extra={
              <Link href="/admin/events">
                <Button type="primary">
                  Etkinliklere Dön
                </Button>
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
        <section style={{ maxWidth: 760, margin: "0 auto" }}>
          <Card style={{ borderRadius: 16 }}>
            <Link href="/admin/events">← Etkinliklere dön</Link>

            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <h1
                style={{
                  fontSize: 34,
                  marginBottom: 8,
                  color: "var(--app-text)",
                }}
              >
                Etkinliği Düzenle
              </h1>

              <p style={{ color: "var(--app-muted)", margin: 0 }}>
                Etkinlik bilgilerini güncelleyebilirsin.
              </p>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Etkinlik Adı"
                name="title"
                rules={[{ required: true, message: "Etkinlik adı zorunludur." }]}
              >
                <Input placeholder="Örn: React Workshop" />
              </Form.Item>

              <Form.Item
                label="Açıklama"
                name="description"
                rules={[{ required: true, message: "Açıklama zorunludur." }]}
              >
                <TextArea rows={4} placeholder="Etkinlik açıklaması" />
              </Form.Item>

              <Form.Item
                label="Konum"
                name="location"
                rules={[{ required: true, message: "Konum zorunludur." }]}
              >
                <Input placeholder="Örn: Ankara" />
              </Form.Item>

              <Form.Item
                label="Tarih"
                name="eventDate"
                rules={[{ required: true, message: "Tarih zorunludur." }]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Kapasite"
                name="capacity"
                rules={[{ required: true, message: "Kapasite zorunludur." }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading}>
                Güncelle
              </Button>
            </Form>
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}