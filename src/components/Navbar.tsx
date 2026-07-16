"use client";

import { Button, Select, Switch, Tag } from "antd";
import { useAppTheme } from "./AppProviders";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type UserRole = "guest" | "user" | "admin" | "super_admin";

type NavItem = {
  href: string;
  label: string;
};

const roleLabels: Record<UserRole, string> = {
  guest: "Ziyaretçi",
  user: "User",
  admin: "Admin",
  super_admin: "Super Admin",
};

export default function Navbar() {
  const pathname = usePathname();
  const { appTheme, toggleTheme } = useAppTheme();
  const [role, setRole] = useState<UserRole>("guest");

  useEffect(() => {
    const readRoleFromStorage = () => {
      const savedRole = localStorage.getItem("eventpass-role") as UserRole | null;

      if (
        savedRole === "guest" ||
        savedRole === "user" ||
        savedRole === "admin" ||
        savedRole === "super_admin"
      ) {
        setRole(savedRole);
      } else {
        setRole("guest");
      }
    };

    readRoleFromStorage();

    window.addEventListener("eventpass-role-change", readRoleFromStorage);

    return () => {
      window.removeEventListener("eventpass-role-change", readRoleFromStorage);
    };
  }, []);

  const handleRoleChange = (value: UserRole) => {
    setRole(value);
    localStorage.setItem("eventpass-role", value);
    window.dispatchEvent(new Event("eventpass-role-change"));
  };

  const handleLogout = () => {
    setRole("guest");
    localStorage.setItem("eventpass-role", "guest");
    window.dispatchEvent(new Event("eventpass-role-change"));
  };

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Ana Sayfa",
    },
    {
      href: "/events",
      label: "Etkinlikler",
    },
  ];

  if (role === "user" || role === "admin") {
    navItems.push({
      href: "/my-tickets",
      label: "Biletlerim",
    });
  }

  if (role === "admin") {
    navItems.push({
      href: "/admin",
      label: "Admin Paneli",
    });
  }

  if (role === "super_admin") {
    navItems.push({
      href: "/super-admin",
      label: "Super Admin",
    });
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "var(--app-surface)",
        borderBottom: "1px solid var(--app-border)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          minHeight: 68,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#1677ff",
            letterSpacing: "-0.5px",
          }}
        >
          EventPass
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: isActive(item.href) ? "#1677ff" : "#374151",
                fontWeight: isActive(item.href) ? 700 : 500,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Switch
            checked={appTheme === "dark"}
            onChange={() => toggleTheme()}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
          <Tag color={role === "guest" ? "default" : "blue"}>
            {roleLabels[role]}
          </Tag>

          <Select<UserRole>
            value={role}
            style={{ width: 150 }}
            onChange={handleRoleChange}
            options={[
              { value: "guest", label: "Ziyaretçi" },
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
              { value: "super_admin", label: "Super Admin" },
            ]}
          />

          {role === "guest" ? (
            <>
              <Link href="/login">
                <Button>Giriş Yap</Button>
              </Link>

              <Link href="/register">
                <Button type="primary">Kayıt Ol</Button>
              </Link>
            </>
          ) : (
            <Button onClick={handleLogout}>Çıkış Yap</Button>
          )}
        </div>
      </div>
    </header>
  );
}