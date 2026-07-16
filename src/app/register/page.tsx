"use client";

import { Button, Card, Form, Input, Select, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

type AccountType = "user" | "admin";

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  accountType: AccountType;
  organizationName?: string;
  adminReason?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm<RegisterFormValues>();

  const accountType = Form.useWatch("accountType", form);

  const onFinish = (values: RegisterFormValues) => {
    console.log("Register form values:", values);

    if (values.accountType === "admin") {
      message.success(
        "Admin başvurun alındı. Super Admin onayından sonra admin olabilirsin."
      );

      router.push("/login");
      return;
    }

    localStorage.setItem("eventpass-role", "user");
    window.dispatchEvent(new Event("eventpass-role-change"));
    message.success("Kayıt başarılı. Kullanıcı olarak giriş yapıldı.");

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
      <Card style={{ width: "100%", maxWidth: 480, borderRadius: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>EventPass</h1>
          <p style={{ color: "var(--app-muted)", margin: 0 }}>Yeni hesap oluştur</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ accountType: "user" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Ad Soyad"
            name="fullName"
            rules={[{ required: true, message: "Ad soyad alanı zorunludur." }]}
          >
            <Input placeholder="Adınızı ve soyadınızı girin" />
          </Form.Item>

          <Form.Item
            label="E-posta"
            name="email"
            rules={[
              { required: true, message: "E-posta alanı zorunludur." },
              { type: "email", message: "Geçerli bir e-posta giriniz." },
            ]}
          >
            <Input placeholder="ornek@mail.com" />
          </Form.Item>

          <Form.Item
            label="Şifre"
            name="password"
            rules={[
              { required: true, message: "Şifre alanı zorunludur." },
              { min: 6, message: "Şifre en az 6 karakter olmalıdır." },
            ]}
          >
            <Input.Password placeholder="Şifrenizi girin" />
          </Form.Item>

          <Form.Item
            label="Hesap Türü"
            name="accountType"
            rules={[{ required: true, message: "Hesap türü seçiniz." }]}
          >
            <Select
              options={[
                { value: "user", label: "Normal kullanıcı" },
                { value: "admin", label: "Admin başvurusu" },
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
                label="Admin Olma Nedeni"
                name="adminReason"
                rules={[
                  {
                    required: true,
                    message: "Admin olma nedeni zorunludur.",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Neden admin olmak istiyorsunuz?"
                />
              </Form.Item>
            </>
          )}

          <Button type="primary" htmlType="submit" block>
            {accountType === "admin" ? "Admin Başvurusu Yap" : "Kayıt Ol"}
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          Zaten hesabın var mı? <Link href="/login">Giriş yap</Link>
        </div>
      </Card>
    </main>
  );
}