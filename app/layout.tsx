import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Noto_Sans_Bengali } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { BottomNavigation } from "@/components/bottom-navigation";
import { GlobalHeader } from "@/components/global-header";

const _geist = Geist({ subsets: ["latin"] });
const _bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  title: "Ramadan Calendar Bangladesh",
  description: "Ramadan prayer times and calendar for Bangladesh",
  generator: "v0.app",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${_bengali.variable}`}>
      <body className="font-sans antialiased dark">
        <GlobalHeader />
        {children}
        <BottomNavigation />
        <Analytics />
      </body>
    </html>
  );
}
