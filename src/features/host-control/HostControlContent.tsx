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
    <div
      className="min-h-screen font-serif text-white px-4 py-10"
      style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-8 relative z-10">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/40 border border-yellow-600/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] mb-2">
            <span className="text-3xl">👑</span>
          </div>
          <p className="text-xs text-yellow-500/80 uppercase tracking-[0.3em] font-bold">
            Host Control Panel
          </p>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-sm">
            {room?.title ?? (
              <span className="text-slate-500 animate-pulse">Loading...</span>
            )}
          </h1>
        </motion.div>

        {/* 参加者数 + 参加URL */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-xl border border-yellow-600/30 bg-black/40 backdrop-blur-md p-6 space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
        >
          {/* 参加者数 */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-900/40 to-black border border-yellow-600/30 flex items-center justify-center text-2xl shadow-inner">
              👥
            </div>
            <div>
              <p className="text-xs text-yellow-500/60 uppercase tracking-wider font-bold mb-1">Participants</p>
              <p className="text-3xl font-black text-white tabular-nums tracking-wide">
                {participants.length}<span className="text-sm font-bold text-slate-400 ml-2">Players</span>
              </p>
            </div>
          </div>

          {/* 参加URL */}
          <div className="space-y-2">
            <p className="text-xs text-yellow-500/60 uppercase tracking-wider font-bold">Invitation URL</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-300 font-mono truncate shadow-inner">
                {playUrl}
              </div>
              <motion.button
                type="button"
                onClick={handleCopyUrl}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={[
                  "flex-shrink-0 px-4 py-3 rounded-lg text-sm font-bold border transition-all duration-200 uppercase tracking-wider",
                  copied
                    ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-yellow-600/20 border-yellow-600/40 text-yellow-200 hover:bg-yellow-600/30 hover:border-yellow-500/60 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]",
                ].join(" ")}
              >
                {copied ? "Copied" : "Copy"}
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
        ルームが見つかりません
      </div>
    )
  }

  return <HostControlInner roomId={roomId} />
}
