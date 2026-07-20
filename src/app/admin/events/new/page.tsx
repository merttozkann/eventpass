"use client";

import {
  App as AntdApp,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RoleGuard from "../../../../components/RoleGuard";

const { TextArea } = Input;

type EventDateValue = {
  toISOString: () => string;
};

type NewEventFormValues = {
  title: string;
  description: string;
  location: string;
  eventDate: EventDateValue;
  capacity: number;
};

export default function NewEventPage() {
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const onFinish = async (values: NewEventFormValues) => {
    const response = await fetch("/api/admin/events", {
      method: "POST",
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
      message.error(data.message || "Etkinlik oluşturulamadı.");
      return;
    }

    message.success("Etkinlik başarıyla oluşturuldu.");
    router.push("/admin/events");
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "32px 24px",
        }}
      >
        <section style={{ maxWidth: 700, margin: "0 auto" }}>
          <Card style={{ borderRadius: 16 }}>
            <Link href="/admin">← Admin paneline dön</Link>

            <h1
              style={{
                fontSize: 30,
                marginTop: 24,
                marginBottom: 8,
                color: "var(--app-text)",
              }}
            >
              Yeni Etkinlik Oluştur
            </h1>

            <p style={{ color: "var(--app-muted)", marginBottom: 24 }}>
              Etkinlik bilgilerini doldurarak yeni bir etkinlik oluşturabilirsin.
            </p>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Etkinlik Adı"
                name="title"
                rules={[
                  { required: true, message: "Etkinlik adı zorunludur." },
                ]}
              >
                <Input placeholder="Örn: React Workshop" />
              </Form.Item>

              <Form.Item
                label="Açıklama"
                name="description"
                rules={[
                  { required: true, message: "Açıklama alanı zorunludur." },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Etkinlik hakkında kısa açıklama yazın"
                />
              </Form.Item>

              <Form.Item
                label="Konum"
                name="location"
                rules={[
                  { required: true, message: "Konum alanı zorunludur." },
                ]}
              >
                <Input placeholder="Örn: Konferans Salonu" />
              </Form.Item>

              <Form.Item
                label="Tarih ve Saat"
                name="eventDate"
                rules={[
                  { required: true, message: "Etkinlik tarihi zorunludur." },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  placeholder="Tarih ve saat seçiniz"
                />
              </Form.Item>

              <Form.Item
                label="Kapasite"
                name="capacity"
                rules={[
                  { required: true, message: "Kapasite alanı zorunludur." },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Örn: 50"
                />
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Etkinlik Oluştur
              </Button>
            </Form>
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}