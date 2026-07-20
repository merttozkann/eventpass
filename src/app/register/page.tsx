"use client";

import {
  App as AntdApp,
  Button,
  Card,
  Form,
  Input,
  Select,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  accountType: "user" | "admin";
  organizationName?: string;
  adminReason?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<RegisterFormValues>();

  const accountType = Form.useWatch("accountType", form);

  const onFinish = async (values: RegisterFormValues) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      message.error(data.message || "Kayıt başarısız.");
      return;
    }

    message.success(data.message || "Kayıt başarılı.");

    if (values.accountType === "admin") {
      router.push("/login");
      return;
    }

    localStorage.setItem("eventpass-role", "user");
    localStorage.setItem("eventpass-user-id", String(data.user.id));
    localStorage.setItem("eventpass-user-email", data.user.email);
    localStorage.setItem("eventpass-user-full-name", data.user.fullName);

    window.dispatchEvent(new Event("eventpass-role-change"));
    router.push("/events");
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 68px)",
        backgroundColor: "var(--app-bg)",
        padding: "48px 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ width: "100%", maxWidth: 500, borderRadius: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: "var(--app-text)" }}>
            EventPass
          </h1>

          <p style={{ color: "var(--app-muted)", margin: 0 }}>
            Yeni hesap oluştur
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            accountType: "user",
          }}
        >
          <Form.Item
            label="Ad Soyad"
            name="fullName"
            rules={[{ required: true, message: "Ad soyad zorunludur." }]}
          >
            <Input placeholder="Adınızı ve soyadınızı girin" />
          </Form.Item>

          <Form.Item
            label="E-posta"
            name="email"
            rules={[
              { required: true, message: "E-posta zorunludur." },
              { type: "email", message: "Geçerli bir e-posta giriniz." },
            ]}
          >
            <Input placeholder="ornek@mail.com" />
          </Form.Item>

          <Form.Item
            label="Şifre"
            name="password"
            rules={[{ required: true, message: "Şifre zorunludur." }]}
          >
            <Input.Password placeholder="Şifrenizi girin" />
          </Form.Item>

          <Form.Item
            label="Hesap Türü"
            name="accountType"
            rules={[{ required: true, message: "Hesap türü zorunludur." }]}
          >
            <Select
              options={[
                { label: "Normal Kullanıcı", value: "user" },
                { label: "Admin Başvurusu", value: "admin" },
              ]}
            />
          </Form.Item>

          {accountType === "admin" && (
            <>
              <Form.Item
                label="Kurum / Kulüp Adı"
                name="organizationName"
                rules={[
                  {
                    required: true,
                    message: "Kurum veya kulüp adı zorunludur.",
                  },
                ]}
              >
                <Input placeholder="Örn: Yazılım Kulübü" />
              </Form.Item>

              <Form.Item
                label="Başvuru Nedeni"
                name="adminReason"
                rules={[
                  {
                    required: true,
                    message: "Başvuru nedeni zorunludur.",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Neden admin olmak istediğinizi yazın"
                />
              </Form.Item>
            </>
          )}

          <Button type="primary" htmlType="submit" block>
            Kayıt Ol
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          Zaten hesabın var mı? <Link href="/login">Giriş yap</Link>
        </div>
      </Card>
    </main>
  );
}