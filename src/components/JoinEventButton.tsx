"use client";

import { Button, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserRole = "guest" | "user" | "admin" | "super_admin";

export default function JoinEventButton() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("guest");

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
  }, []);

  const handleJoin = () => {
    if (role === "guest") {
      message.warning("Etkinliğe katılmak için önce giriş yapmalısın.");
      router.push("/login");
      return;
    }

    if (role === "super_admin") {
      message.warning("Super Admin hesabı ile etkinliğe katılım yapılmaz.");
      return;
    }

    message.success("Etkinlik kaydın oluşturuldu.");
    router.push("/my-tickets");
  };

  return (
    <Button type="primary" size="large" block onClick={handleJoin}>
      Etkinliğe Katıl
    </Button>
  );
}