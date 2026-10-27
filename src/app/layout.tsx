import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TamaWallet — Pengelolaan Keuangan Pribadi",
  description:
    "Aplikasi pengelolaan keuangan pribadi yang transparan, deterministik, dan dapat dipercaya.",
  applicationName: "TamaWallet",
  keywords: ["finance", "wallet", "budget", "pwa", "tamawallet"],
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
