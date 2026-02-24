"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { RoomProvider } from "@/providers/RoomProvider"
import { EntryForm } from "@/features/play/EntryForm"
import { PlayerGameView } from "@/features/play/PlayerGameView"

export function PlayContent() {
  const params = useParams()
  const roomId = params?.roomId as string

  const [participantId, setParticipantId] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("participantId")
    setParticipantId(stored)
    setIsHydrated(true)
  }, [])

  const handleEntered = (id: string) => {
    setParticipantId(id)
  }

  // サーバーサイドレンダリング中はローディング表示
  if (!isHydrated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f23 100%)" }}
      >
        <div className="text-slate-400 text-sm">読み込み中...</div>
      </div>
    )
  }

  if (!participantId) {
    return <EntryForm roomId={roomId} onEntered={handleEntered} />
  }

  return (
    <RoomProvider roomId={roomId}>
      <PlayerGameView />
    </RoomProvider>
  )
}
