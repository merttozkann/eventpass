"use client";

import { App as AntdApp, Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type JoinEventButtonProps = {
  eventId: number;
  isFull?: boolean;
};

export default function JoinEventButton({
  eventId,
  isFull = false,
}: JoinEventButtonProps) {
  const router = useRouter();
  const { message } = AntdApp.useApp();

  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    async function checkRegistrationStatus() {
      try {
        const role = localStorage.getItem("eventpass-role") || "guest";
        const userId = localStorage.getItem("eventpass-user-id");

        if (role === "guest" || !userId) {
          setCheckingStatus(false);
          return;
        }

        const response = await fetch(
          `/api/events/${eventId}/registration-status?userId=${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setCheckingStatus(false);
          return;
        }

        setIsRegistered(data.isRegistered);
      } catch (error) {
        console.error("Registration status check error:", error);
      } finally {
        setCheckingStatus(false);
      }
    }

    checkRegistrationStatus();
  }, [eventId]);

  const handleJoinEvent = async () => {
    if (isFull) {
      message.warning("Etkinlik kapasitesi dolu.");
      return;
    }

    if (isRegistered) {
      message.info("Bu etkinliğe zaten kayıtlısın.");
      return;
    }

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

      setIsRegistered(true);

      message.success(data.message || "Etkinliğe kayıt oldun.");
      router.push("/my-tickets");
    } catch (error) {
      console.error("Join event error:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  let buttonText = "Etkinliğe Katıl";

  if (isFull) {
    buttonText = "Etkinlik Dolu";
  } else if (isRegistered) {
    buttonText = "Zaten Kayıtlısın";
  }

  return (
    <Button
      type="primary"
      size="large"
      loading={loading || checkingStatus}
      disabled={isFull || isRegistered}
      onClick={handleJoinEvent}
    >
      {buttonText}
    </Button>
  );
}