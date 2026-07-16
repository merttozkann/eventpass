"use client";

import { Button, Card, DatePicker, Form, Input, InputNumber, message } from "antd";
import Link from "next/link";
import RoleGuard from "../../../../components/RoleGuard";

const { TextArea } = Input;

type NewEventFormValues = {
  title: string;
  description: string;
  location: string;
  eventDate: unknown;
  capacity: number;
};

export default function NewEventPage() {
  const onFinish = (values: NewEventFormValues) => {
    console.log("New event values:", values);
    message.success("Etkinlik başarıyla oluşturuldu.");
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--app-bg)",
        padding: "32px 24px",
      }}
    >
      <section style={{ maxWidth: 700, margin: "0 auto" }}>
        <Card>
          <Link href="/admin">← Admin paneline dön</Link>

          <h1 style={{ fontSize: 30, marginTop: 24, marginBottom: 8 }}>
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
              label="Tarih"
              name="eventDate"
              rules={[
                { required: true, message: "Etkinlik tarihi zorunludur." },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Tarih seçiniz"
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