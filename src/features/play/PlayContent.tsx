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
        className="min-h-screen flex items-center justify-center font-serif"
        style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
      >
        <div className="text-yellow-500/80 text-sm tracking-widest uppercase">Loading...</div>
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
