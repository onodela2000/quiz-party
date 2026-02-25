import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Quiz Party JP | スマホだけで、会場が熱狂するクイズ大会プラットフォーム",
  description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。企業研修・忘年会・学校イベント・配信に最適。",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Quiz Party JP | スマホだけで、会場が熱狂する。",
    description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
    type: "website",
    locale: "ja_JP",
    siteName: "Quiz Party JP",
    images: [{ url: "/icon.svg", width: 512, height: 512, alt: "Quiz Party JP" }],
  },
  twitter: {
    card: "summary",
    title: "Quiz Party JP | スマホだけで、会場が熱狂する。",
    description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
    images: ["/icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
