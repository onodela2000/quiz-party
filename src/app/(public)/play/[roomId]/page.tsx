import type { Metadata } from "next";
import { PlayContent } from "@/features/play/PlayContent";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ roomId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { roomId } = await params;
  const supabase = await createClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("title, subtitle")
    .eq("id", roomId)
    .single();

  if (!room?.title) {
    return {};
  }

  return {
    title: room.title,
    description:
      room.subtitle ??
      "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
    openGraph: {
      title: room.title,
      description:
        room.subtitle ??
        "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
    },
    twitter: {
      title: room.title,
      description:
        room.subtitle ??
        "クイズ大会を今すぐ無料で開催しよう。URLを共有するだけで参加者全員がリアルタイムで繋がる。",
    },
  };
}

export default function Page() {
  return <PlayContent />;
}
