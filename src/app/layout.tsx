import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Navbar from "../components/Navbar";
import AppProviders from "../components/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventPass",
  description: "QR kodlu etkinlik katılım sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <AntdRegistry>
          <AppProviders>
            <Navbar />
            {children}
          </AppProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}