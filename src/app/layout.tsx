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
  title: "Quiz King | 究極のクイズバトルプラットフォーム",
  description: "リアルタイムでクイズ大会を開催・参加できるWebアプリケーション。友達や同僚と盛り上がろう！",
  openGraph: {
    title: "Quiz King | 究極のクイズバトルプラットフォーム",
    description: "リアルタイムでクイズ大会を開催・参加できるWebアプリケーション。友達や同僚と盛り上がろう！",
    type: "website",
    locale: "ja_JP",
    siteName: "Quiz King",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz King | 究極のクイズバトルプラットフォーム",
    description: "リアルタイムでクイズ大会を開催・参加できるWebアプリケーション。",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
