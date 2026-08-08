import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quizparty.jp";
const gaId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Quiz Party JP | スマホだけで、会場が熱狂するクイズ大会プラットフォーム",
  description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。企業研修・忘年会・学校イベント・配信に最適。",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Quiz Party JP | スマホだけで、会場が熱狂する。",
    description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
    type: "website",
    locale: "ja_JP",
    siteName: "Quiz Party JP",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Quiz Party JP - スマホだけで会場が熱狂するクイズ大会プラットフォーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Party JP | スマホだけで、会場が熱狂する。",
    description: "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
    images: ["/opengraph-image.png"],
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
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
