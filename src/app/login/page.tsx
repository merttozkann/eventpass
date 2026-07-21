"use client";

import { App as AntdApp, Button, Card, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserRole = "user" | "admin" | "super_admin";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const onFinish = async (values: LoginFormValues) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok || !data.user) {
      message.error(data.message || "Giriş başarısız.");
      return;
    }

    localStorage.setItem("eventpass-role", data.user.role);
    localStorage.setItem("eventpass-user-id", String(data.user.id));
    localStorage.setItem("eventpass-user-email", data.user.email);
    localStorage.setItem("eventpass-user-full-name", data.user.fullName);

    window.dispatchEvent(new Event("eventpass-role-change"));

    message.success(data.message || "Giriş başarılı.");

    if (data.user.role === "admin") {
      router.push("/admin");
      return;
    }

    if (data.user.role === "super_admin") {
      router.push("/super-admin");
      return;
    }

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
      <Card style={{ width: "100%", maxWidth: 430, borderRadius: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: "var(--app-text)" }}>
            EventPass
          </h1>

          <p style={{ color: "var(--app-muted)", margin: 0 }}>
            Hesabına giriş yap
          </p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="E-posta"
            name="email"
            rules={[
              { required: true, message: "E-posta alanı zorunludur." },
              { type: "email", message: "Geçerli bir e-posta giriniz." },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            label="Şifre"
            name="password"
            rules={[{ required: true, message: "Şifre alanı zorunludur." }]}
          >
            <Input.Password placeholder="Şifrenizi girin" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Giriş Yap
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          Hesabın yok mu? <Link href="/register">Kayıt ol</Link>
        </div>
      </Card>
    </main>
  );
}
