import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "TamaWallet — Pengelolaan Keuangan Pribadi",
  description: "Aplikasi pengelolaan keuangan pribadi yang bersih, akurat, dan mandiri.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white font-sans text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
        <NextTopLoader
          color="#09090b"
          initialPosition={0.15}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px rgba(9,9,11,0.5)"
          zIndex={999999}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
