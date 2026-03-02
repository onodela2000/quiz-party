"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { RoomProvider } from "@/providers/RoomProvider"
import { EntryForm } from "@/features/play/EntryForm"
import { PlayerGameView } from "@/features/play/PlayerGameView"
import { getParticipantId, clearParticipantId } from "@/lib/participant-token"
import { createClient } from "@/lib/supabase/client"

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json())

export function PlayContent() {
  const params = useParams()
  const roomId = params?.roomId as string

  const [participantId, setParticipantId] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  const { data: roomData } = useSWR<{ room: { title: string; subtitle: string | null } }>(
    roomId ? `/api/rooms/${roomId}` : null,
    fetcher
  )

  useEffect(() => {
    const stored = getParticipantId(roomId)
    if (!stored) {
      setIsHydrated(true)
      return
    }
    // Verify the participant still exists in DB
    const supabase = createClient()
    supabase
      .from("participants")
      .select("id")
      .eq("id", stored)
      .eq("room_id", roomId)
      .single()
      .then(({ data }) => {
        if (data) {
          setParticipantId(stored)
        } else {
          clearParticipantId(roomId)
        }
        setIsHydrated(true)
      })
  }, [roomId])

  const handleEntered = (id: string) => {
    setParticipantId(id)
  }

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
    return (
      <EntryForm
        roomId={roomId}
        title={roomData?.room.title ?? ""}
        subtitle={roomData?.room.subtitle ?? null}
        onEntered={handleEntered}
      />
    )
  }

  return (
    <RoomProvider roomId={roomId}>
      <PlayerGameView title={roomData?.room.title ?? ""} />
    </RoomProvider>
  )
}
