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

export const metadata: Metadata = {
  title: "Quiz Party JP | スマホだけで、会場が熱狂するクイズ大会プラットフォーム",
  description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。企業研修・忘年会・学校イベント・配信に最適。",
  openGraph: {
    title: "Quiz Party JP | スマホだけで、会場が熱狂する。",
    description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
    type: "website",
    locale: "ja_JP",
    siteName: "Quiz Party JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Party JP | スマホだけで、会場が熱狂する。",
    description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" style={{ backgroundColor: "#1a0303" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
