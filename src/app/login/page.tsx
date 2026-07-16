"use client";

import { Button, Card, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserRole = "user" | "admin" | "super_admin";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const onFinish = (values: LoginFormValues) => {
    let role: UserRole | null = null;

    if (values.email === "user@example.com") {
      role = "user";
    }

    if (values.email === "admin@example.com") {
      role = "admin";
    }

    if (values.email === "super@example.com") {
      role = "super_admin";
    }

    if (!role) {
      message.error("Geçersiz e-posta. Deneme hesaplarından birini kullan.");
      return;
    }

    localStorage.setItem("eventpass-role", role);
    window.dispatchEvent(new Event("eventpass-role-change"));
    message.success("Giriş başarılı.");

    if (role === "admin") {
      router.push("/admin");
      return;
    }

    if (role === "super_admin") {
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
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>EventPass</h1>
          <p style={{ color: "var(--app-muted)", margin: 0 }}>Hesabına giriş yap</p>
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

        <Card size="small" style={{ marginTop: 20, backgroundColor: "#fafafa" }}>
          <p style={{ marginTop: 0, fontWeight: 600 }}>Deneme hesapları:</p>

          <p style={{ margin: "6px 0" }}>
            User: <strong>user@example.com</strong>
          </p>

          <p style={{ margin: "6px 0" }}>
            Admin: <strong>admin@example.com</strong>
          </p>

          <p style={{ margin: "6px 0" }}>
            Super Admin: <strong>super@example.com</strong>
          </p>
        </Card>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          Hesabın yok mu? <Link href="/register">Kayıt ol</Link>
        </div>
      </Card>
    </main>
  );
}