"use client";

import {
    Alert,
    App as AntdApp,
    Button,
    Card,
    Descriptions,
    Form,
    Input,
    Spin,
} from "antd";
import { useEffect, useState } from "react";
import RoleGuard from "../../components/RoleGuard";

type ProfileUser = {
    id: number;
    fullName: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    createdAt?: string;
};

type ProfileFormValues = {
    fullName: string;
};

type PasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

function formatRole(role: ProfileUser["role"]) {
    if (role === "ADMIN") {
        return "Admin";
    }

    if (role === "SUPER_ADMIN") {
        return "Super Admin";
    }

    return "Kullanıcı";
}

export default function ProfilePage() {
    const { message } = AntdApp.useApp();

    const [profileForm] = Form.useForm<ProfileFormValues>();
    const [passwordForm] = Form.useForm<PasswordFormValues>();

    const [user, setUser] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const userId = localStorage.getItem("eventpass-user-id");

                if (!userId) {
                    setErrorMessage("Kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
                    return;
                }

                const response = await fetch(`/api/profile?userId=${userId}`);
                const data = await response.json();

                if (!response.ok) {
                    setErrorMessage(data.message || "Profil bilgileri alınamadı.");
                    return;
                }

                setUser(data.user);
            } catch (error) {
                console.error("Profile page error:", error);
                setErrorMessage("Bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    useEffect(() => {
        if (user) {
            profileForm.setFieldsValue({
                fullName: user.fullName,
            });
        }
    }, [user, profileForm]);

    const handleUpdateProfile = async (values: ProfileFormValues) => {
        try {
            setProfileLoading(true);

            const userId = localStorage.getItem("eventpass-user-id");

            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    fullName: values.fullName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                message.error(data.message || "Profil güncellenemedi.");
                return;
            }

            setUser(data.user);

            localStorage.setItem("eventpass-user-full-name", data.user.fullName);
            window.dispatchEvent(new Event("eventpass-role-change"));

            message.success(data.message || "Profil güncellendi.");
        } catch (error) {
            console.error("Update profile page error:", error);
            message.error("Bir hata oluştu.");
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (values: PasswordFormValues) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error("Yeni şifreler uyuşmuyor.");
            return;
        }

        try {
            setPasswordLoading(true);

            const userId = localStorage.getItem("eventpass-user-id");

            const response = await fetch("/api/profile/password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                message.error(data.message || "Şifre değiştirilemedi.");
                return;
            }

            passwordForm.resetFields();
            message.success(data.message || "Şifre başarıyla değiştirildi.");
        } catch (error) {
            console.error("Password change page error:", error);
            message.error("Bir hata oluştu.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <RoleGuard allowedRoles={["user", "admin", "super_admin"]}>
            <main
                style={{
                    minHeight: "calc(100vh - 68px)",
                    backgroundColor: "var(--app-bg)",
                    padding: "48px 24px",
                }}
            >
                <section style={{ maxWidth: 900, margin: "0 auto" }}>
                    <Card style={{ borderRadius: 16 }}>
                        <div style={{ marginBottom: 32 }}>
                            <h1
                                style={{
                                    fontSize: 34,
                                    marginBottom: 8,
                                    color: "var(--app-text)",
                                }}
                            >
                                Profilim
                            </h1>

                            <p style={{ color: "var(--app-muted)", margin: 0 }}>
                                Hesap bilgilerini görüntüleyebilir ve şifreni değiştirebilirsin.
                            </p>
                        </div>

                        {loading && <Spin size="large" />}

                        {!loading && errorMessage && (
                            <Alert type="error" showIcon message={errorMessage} />
                        )}

                        {!loading && !errorMessage && user && (
                            <>
                                <Descriptions
                                    bordered
                                    column={1}
                                    style={{ marginBottom: 32 }}
                                    items={[
                                        {
                                            key: "fullName",
                                            label: "Ad Soyad",
                                            children: user.fullName,
                                        },
                                        {
                                            key: "email",
                                            label: "E-posta",
                                            children: user.email,
                                        },
                                        {
                                            key: "role",
                                            label: "Rol",
                                            children: formatRole(user.role),
                                        },
                                    ]}
                                />

                                <Card
                                    title="Profil Bilgilerini Güncelle"
                                    style={{ borderRadius: 16, marginBottom: 24 }}
                                >
                                    <Form
                                        form={profileForm}
                                        layout="vertical"
                                        onFinish={handleUpdateProfile}
                                    >
                                        <Form.Item
                                            label="Ad Soyad"
                                            name="fullName"
                                            rules={[
                                                { required: true, message: "Ad soyad zorunludur." },
                                            ]}
                                        >
                                            <Input placeholder="Ad soyad" />
                                        </Form.Item>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={profileLoading}
                                        >
                                            Profili Güncelle
                                        </Button>
                                    </Form>
                                </Card>

                                <Card title="Şifre Değiştir" style={{ borderRadius: 16 }}>
                                    <Form
                                        form={passwordForm}
                                        layout="vertical"
                                        onFinish={handleChangePassword}
                                    >
                                        <Form.Item
                                            label="Mevcut Şifre"
                                            name="currentPassword"
                                            rules={[
                                                { required: true, message: "Mevcut şifre zorunludur." },
                                            ]}
                                        >
                                            <Input.Password placeholder="Mevcut şifrenizi girin" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Yeni Şifre"
                                            name="newPassword"
                                            rules={[
                                                { required: true, message: "Yeni şifre zorunludur." },
                                                {
                                                    min: 6,
                                                    message: "Yeni şifre en az 6 karakter olmalıdır.",
                                                },
                                            ]}
                                        >
                                            <Input.Password placeholder="Yeni şifrenizi girin" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Yeni Şifre Tekrar"
                                            name="confirmPassword"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Yeni şifre tekrarı zorunludur.",
                                                },
                                            ]}
                                        >
                                            <Input.Password placeholder="Yeni şifrenizi tekrar girin" />
                                        </Form.Item>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={passwordLoading}
                                        >
                                            Şifreyi Değiştir
                                        </Button>
                                    </Form>
                                </Card>
                            </>
                        )}
                    </Card>
                </section>
            </main>
        </RoleGuard>
    );
}