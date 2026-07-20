"use client";

import { Card } from "antd";
import { useEffect, useRef } from "react";

type QrScannerProps = {
  onScanSuccess: (qrCode: string) => void;
};

export default function QrScanner({ onScanSuccess }: QrScannerProps) {
  const hasScannedRef = useRef(false);
  const scannerRef = useRef<{ clear: () => Promise<void> } | null>(null);
  const onScanSuccessRef = useRef(onScanSuccess);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    let isMounted = true;

    async function startScanner() {
      const { Html5QrcodeScanner } = await import("html5-qrcode");

      if (!isMounted) return;

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        false
      );

      scannerRef.current = scanner;

      scanner.render(
        async (decodedText) => {
          if (hasScannedRef.current) return;

          hasScannedRef.current = true;

          await scanner.clear();

          onScanSuccessRef.current(decodedText);
        },
        () => {
          // Her karede okuyamazsa buraya düşebilir, sorun değil.
        }
      );
    }

    startScanner();

    return () => {
      isMounted = false;

      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <Card style={{ borderRadius: 16, marginTop: 24 }}>
      <h2 style={{ marginTop: 0, color: "var(--app-text)" }}>
        Kamera ile QR Okut
      </h2>

      <p style={{ color: "var(--app-muted)" }}>
        Kameraya bilet QR kodunu göster. Okutunca check-in otomatik yapılacak.
      </p>

      <div id="qr-reader" style={{ width: "100%" }} />
    </Card>
  );
}