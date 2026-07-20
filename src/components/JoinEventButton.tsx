"use client";

import { App as AntdApp, Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

type JoinEventButtonProps = {
  eventId: number;
};

export default function JoinEventButton({ eventId }: JoinEventButtonProps) {
  const router = useRouter();
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);

  const handleJoinEvent = async () => {
    const role = localStorage.getItem("eventpass-role") || "guest";
    const userId = localStorage.getItem("eventpass-user-id");

    if (role === "guest" || !userId) {
      message.warning("Etkinliğe katılmak için giriş yapmalısın.");
      router.push("/login");
      return;
    }

    if (role === "super_admin") {
      message.warning("Super admin etkinliğe katılamaz.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Etkinliğe kayıt olunamadı.");
        return;
      }

      message.success(data.message || "Etkinliğe kayıt oldun.");
      router.push("/my-tickets");
    } catch (error) {
      console.error("Join event error:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      size="large"
      loading={loading}
      onClick={handleJoinEvent}
    >
      Etkinliğe Katıl
    </Button>
  );
}