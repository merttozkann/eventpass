"use client";

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Result,
  Space,
  message,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "../../../../../components/RoleGuard";
import { events } from "../../../../../data/events";

const { TextArea } = Input;

type EditEventFormValues = {
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
};

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm<EditEventFormValues>();

  const eventId = Number(params.id);
  const event = events.find((event) => event.id === eventId);

  const onFinish = (values: EditEventFormValues) => {
    console.log("Updated event values:", values);

    message.success("Etkinlik bilgileri güncellendi.");

    router.push("/admin/events");
  };

  if (!event) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <main
          style={{
            minHeight: "calc(100vh - 68px)",
            backgroundColor: "var(--app-bg)",
            padding: "32px 24px",
          }}
        >
          <Card style={{ maxWidth: 700, margin: "0 auto" }}>
            <Result
              status="404"
              title="Etkinlik bulunamadı"
              subTitle="Bu id değerine sahip bir etkinlik bulunamadı."
              extra={
                <Link href="/admin/events">
                  <Button type="primary">Etkinliklere Dön</Button>
                </Link>
              }
            />
          </Card>
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
          padding: "32px 24px",
        }}
      >
        <section style={{ maxWidth: 750, margin: "0 auto" }}>
          <Card>
            <Link href="/admin/events">← Etkinliklerime dön</Link>

            <h1 style={{ fontSize: 30, marginTop: 24, marginBottom: 8 }}>
              Etkinlik Düzenle
            </h1>

            <p style={{ color: "var(--app-muted)", marginBottom: 24 }}>
              Etkinlik bilgilerini güncelleyebilirsin.
            </p>

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                title: event.title,
                description: event.description,
                location: event.location,
                date: event.date,
                capacity: event.capacity,
              }}
              onFinish={onFinish}
            >
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
                <TextArea rows={4} placeholder="Etkinlik açıklaması" />
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
                name="date"
                rules={[
                  { required: true, message: "Tarih alanı zorunludur." },
                ]}
              >
                <Input placeholder="Örn: 15 Temmuz 2026" />
              </Form.Item>

              <Form.Item
                label="Kapasite"
                name="capacity"
                rules={[
                  { required: true, message: "Kapasite alanı zorunludur." },
                ]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>

              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Link href="/admin/events">
                  <Button>İptal</Button>
                </Link>

                <Button type="primary" htmlType="submit">
                  Güncelle
                </Button>
              </Space>
            </Form>
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}