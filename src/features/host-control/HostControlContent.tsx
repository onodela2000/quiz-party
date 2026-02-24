"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import useSWR from "swr"
import { RoomProvider, useRoom } from "@/providers/RoomProvider"
import { GameProvider } from "@/providers/GameProvider"
import { ControlPanel } from "./ControlPanel"
import type { Room } from "@/types/room"
import type { Quiz } from "@/types/quiz"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Fetch failed")
    return res.json()
  })

/** RoomProvider 内でのみ呼ばれる内側コンポーネント */
function HostControlBody({
  roomId,
  quizzes,
  room,
}: {
  roomId: string
  quizzes: Quiz[]
  room: Room | undefined
}) {
  const [copied, setCopied] = useState(false)
  const { participants } = useRoom()

  const playUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/play/${roomId}`
      : `/play/${roomId}`

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(playUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API が使えない場合は無視
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold">
            ホスト操作パネル
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            {room?.title ?? (
              <span className="text-white/30 animate-pulse">読み込み中...</span>
            )}
          </h1>
        </motion.div>

        {/* 参加者数 + 参加URL */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4"
        >
          {/* 参加者数 */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-lg">
              👥
            </div>
            <div>
              <p className="text-xs text-white/40">参加者数</p>
              <p className="text-xl font-bold text-white">
                {participants.length}人
              </p>
            </div>
          </div>

          {/* 参加URL */}
          <div className="space-y-1.5">
            <p className="text-xs text-white/40">参加URL</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={playUrl}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 focus:outline-none"
              />
              <motion.button
                type="button"
                onClick={handleCopyUrl}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={[
                  "flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                  copied
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-white/5 border-white/10 hover:border-white/30 text-white/70",
                ].join(" ")}
              >
                {copied ? "コピー済み" : "コピー"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* コントロールパネル */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <ControlPanel quizzes={quizzes} />
        </motion.div>
      </div>
    </div>
  )
}

/** Provider でラップした中間コンポーネント */
function HostControlInner({ roomId }: { roomId: string }) {
  const { data: roomData } = useSWR<{ room: Room }>(
    `/api/rooms/${roomId}`,
    fetcher,
    { refreshInterval: 10000 }
  )

  const { data: quizzesData } = useSWR<{ quizzes: Quiz[] }>(
    `/api/quizzes?roomId=${roomId}`,
    fetcher
  )

  const room = roomData?.room
  const quizzes = quizzesData?.quizzes ?? []

  return (
    <GameProvider roomId={roomId}>
      <RoomProvider roomId={roomId}>
        <HostControlBody roomId={roomId} quizzes={quizzes} room={room} />
      </RoomProvider>
    </GameProvider>
  )
}

export function HostControlContent() {
  const params = useParams()
  const searchParams = useSearchParams()

  const roomId = typeof params?.roomId === "string" ? params.roomId : ""
  // hostId は URL クエリから取得（参照のみ。保存は作成時に実施済み）
  const _hostId = searchParams?.get("hostId") ?? null

  if (!roomId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40">
        ルームが見つかりません
      </div>
    )
  }

  return <HostControlInner roomId={roomId} />
}
