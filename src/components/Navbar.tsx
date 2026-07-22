"use client";

import { Button, Space } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "guest" | "user" | "admin" | "super_admin";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("guest");
  const [fullName, setFullName] = useState("");

  const readUserFromLocalStorage = () => {
    const storedRole =
      (localStorage.getItem("eventpass-role") as UserRole | null) || "guest";

    const storedFullName = localStorage.getItem("eventpass-user-full-name") || "";

    setRole(storedRole);
    setFullName(storedFullName);
  };

  useEffect(() => {
    readUserFromLocalStorage();

    window.addEventListener("eventpass-role-change", readUserFromLocalStorage);

    return () => {
      window.removeEventListener(
        "eventpass-role-change",
        readUserFromLocalStorage
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eventpass-role");
    localStorage.removeItem("eventpass-user-id");
    localStorage.removeItem("eventpass-user-email");
    localStorage.removeItem("eventpass-user-full-name");

    setRole("guest");
    setFullName("");

    window.dispatchEvent(new Event("eventpass-role-change"));

    router.push("/");
    router.refresh();
  };

  const isLoggedIn = role !== "guest";

  return (
    <header
      style={{
        height: 68,
        borderBottom: "1px solid var(--app-border)",
        backgroundColor: "var(--app-card)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--app-text)",
          textDecoration: "none",
        }}
      >
        EventPass
      </Link>

      <Space size="middle">
        <Link href="/events">
          <Button type="text">Etkinlikler</Button>
        </Link>

        {(role === "user" || role === "admin") && (
          <Link href="/my-tickets">
            <Button type="text">Biletlerim</Button>
          </Link>
        )}

        {role === "admin" && (
          <>
            <Link href="/admin">
              <Button type="text">Admin Paneli</Button>
            </Link>

            <Link href="/admin/events">
              <Button type="text">Etkinliklerim</Button>
            </Link>

            <Link href="/admin/check-in">
              <Button type="text">Check-in</Button>
            </Link>
          </>
        )}

        {role === "super_admin" && (
          <Link href="/super-admin">
            <Button type="text">Super Admin</Button>
          </Link>
        )}

        {!isLoggedIn && (
          <>
            <Link href="/login">
              <Button>Giriş Yap</Button>
            </Link>

            <Link href="/register">
              <Button type="primary">Kayıt Ol</Button>
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link href="/profile">
              <Button type="text">Profilim</Button>
            </Link>

            <span style={{ color: "var(--app-muted)" }}>
              {fullName || role}
            </span>

            <Button danger onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </>
        )}
      </Space>
    </header>
  );
}