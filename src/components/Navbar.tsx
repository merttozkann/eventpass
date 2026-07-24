"use client";

import {
  Button,
  Divider,
  Drawer,
  Grid,
  Space,
  Switch,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppTheme } from "./AppProviders";

type UserRole = "guest" | "user" | "admin" | "super_admin";

type NavbarLink = {
  label: string;
  href: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const screens = Grid.useBreakpoint();

  const { appTheme, toggleTheme } = useAppTheme();

  const [role, setRole] = useState<UserRole>("guest");
  const [fullName, setFullName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isDesktop = Boolean(screens.md);
  const isLoggedIn = role !== "guest";

  const readUserFromLocalStorage = () => {
    const storedRole =
      (localStorage.getItem("eventpass-role") as UserRole | null) || "guest";

    const storedFullName =
      localStorage.getItem("eventpass-user-full-name") || "";

    setRole(storedRole);
    setFullName(storedFullName);
  };

  useEffect(() => {
    readUserFromLocalStorage();

    window.addEventListener(
      "eventpass-role-change",
      readUserFromLocalStorage
    );

    return () => {
      window.removeEventListener(
        "eventpass-role-change",
        readUserFromLocalStorage
      );
    };
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("eventpass-role");
    localStorage.removeItem("eventpass-user-id");
    localStorage.removeItem("eventpass-user-email");
    localStorage.removeItem("eventpass-user-full-name");

    setRole("guest");
    setFullName("");
    setDrawerOpen(false);

    window.dispatchEvent(new Event("eventpass-role-change"));

    router.push("/");
    router.refresh();
  };

  const getNavbarLinks = (): NavbarLink[] => {
    const links: NavbarLink[] = [
      {
        label: "Etkinlikler",
        href: "/events",
      },
    ];

    if (role === "user" || role === "admin") {
      links.push({
        label: "Biletlerim",
        href: "/my-tickets",
      });
    }

    if (role === "admin") {
      links.push(
        {
          label: "Admin Paneli",
          href: "/admin",
        },
        {
          label: "Etkinliklerim",
          href: "/admin/events",
        },
        {
          label: "Check-in",
          href: "/admin/check-in",
        }
      );
    }

    if (role === "super_admin") {
      links.push({
        label: "Super Admin",
        href: "/super-admin",
      });
    }

    if (isLoggedIn) {
      links.push({
        label: "Profilim",
        href: "/profile",
      });
    }

    return links;
  };

  const navbarLinks = getNavbarLinks();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        style={{
          minHeight: 68,
          width: "100%",
          borderBottom: "1px solid var(--app-border)",
          backgroundColor: "var(--app-surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: isDesktop ? "0 32px" : "0 16px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: isDesktop ? 24 : 21,
            fontWeight: 700,
            color: "var(--app-text)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          EventPass
        </Link>

        {isDesktop ? (
          <Space size="small" wrap>
            {navbarLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                <Button
                  type={isActive(item.href) ? "primary" : "text"}
                >
                  {item.label}
                </Button>
              </Link>
            ))}

            <Switch
              checked={appTheme === "dark"}
              onChange={toggleTheme}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />

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
                <span
                  style={{
                    color: "var(--app-muted)",
                    maxWidth: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fullName || role}
                </span>

                <Button danger onClick={handleLogout}>
                  Çıkış Yap
                </Button>
              </>
            )}
          </Space>
        ) : (
          <Button
            type="text"
            aria-label="Menüyü aç"
            onClick={() => setDrawerOpen(true)}
            style={{
              width: 44,
              height: 44,
              padding: 0,
              fontSize: 27,
              color: "var(--app-text)",
            }}
          >
            ☰
          </Button>
        )}
      </header>

      <Drawer
        title="EventPass Menü"
        placement="right"
        open={drawerOpen}
        size={340}
        onClose={() => setDrawerOpen(false)}
      >
        {isLoggedIn && (
          <>
            <div
              style={{
                padding: "4px 0 16px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "var(--app-muted)",
                  marginBottom: 4,
                }}
              >
                Giriş yapan kullanıcı
              </div>

              <strong
                style={{
                  color: "var(--app-text)",
                  fontSize: 16,
                }}
              >
                {fullName || role}
              </strong>
            </div>

            <Divider style={{ margin: "0 0 16px" }} />
          </>
        )}

        <Space
          orientation="vertical"
          size="small"
          style={{ width: "100%" }}
        >
          {navbarLinks.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              style={{ width: "100%" }}
              onClick={() => setDrawerOpen(false)}
            >
              <Button
                type={isActive(item.href) ? "primary" : "text"}
                block
                style={{
                  height: 44,
                  textAlign: "left",
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Space>

        <Divider />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 44,
          }}
        >
          <span style={{ color: "var(--app-text)" }}>Karanlık tema</span>

          <Switch
            checked={appTheme === "dark"}
            onChange={toggleTheme}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </div>

        <Divider />

        {!isLoggedIn ? (
          <Space
            orientation="vertical"
            size="middle"
            style={{ width: "100%" }}
          >
            <Link
              href="/login"
              style={{ width: "100%" }}
              onClick={() => setDrawerOpen(false)}
            >
              <Button block>Giriş Yap</Button>
            </Link>

            <Link
              href="/register"
              style={{ width: "100%" }}
              onClick={() => setDrawerOpen(false)}
            >
              <Button type="primary" block>
                Kayıt Ol
              </Button>
            </Link>
          </Space>
        ) : (
          <Button danger block onClick={handleLogout}>
            Çıkış Yap
          </Button>
        )}
      </Drawer>
    </>
  );
}