"use client";

import { Button, Card, Result } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

type UserRole = "guest" | "user" | "admin" | "super_admin";

type RoleGuardProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const [role, setRole] = useState<UserRole>("guest");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("eventpass-role") as UserRole | null;

    if (
      savedRole === "guest" ||
      savedRole === "user" ||
      savedRole === "admin" ||
      savedRole === "super_admin"
    ) {
      setRole(savedRole);
    }

    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "32px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card style={{ maxWidth: 600, width: "100%" }}>
          <Result
            status="403"
            title="Yetkisiz Erişim"
            subTitle="Bu sayfayı görüntülemek için yeterli yetkin yok."
            extra={
              <Link href="/">
                <Button type="primary">Ana Sayfaya Dön</Button>
              </Link>
            }
          />
        </Card>
      </main>
    );
  }

  return <>{children}</>;
}