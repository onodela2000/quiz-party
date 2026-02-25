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
  title: "Quiz Party JP | クイズ大会を、たった3分で作れる。完全無料。",
  description: "飲み会・研修・配信、どこでも盛り上がるクイズ大会を無料で。登録不要・アプリ不要、URLを共有するだけで全員がスマホから参加できる。",
  openGraph: {
    title: "Quiz Party JP | クイズ大会を、たった3分で作れる。",
    description: "飲み会・研修・配信、どこでも盛り上がるクイズ大会を無料で。URLを共有するだけで全員がスマホから参加できる。",
    type: "website",
    locale: "ja_JP",
    siteName: "Quiz Party JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Party JP | クイズ大会を、たった3分で作れる。",
    description: "飲み会・研修・配信、どこでも盛り上がるクイズ大会を無料で。URLを共有するだけで全員がスマホから参加できる。",
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
