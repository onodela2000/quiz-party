'use client'

import { createContext, useContext } from 'react'
import { useGamePhase } from '@/hooks/useGamePhase'
import { useParticipants } from '@/hooks/useParticipants'
import type { GamePhase } from '@/types/game'
import type { Participant } from '@/types/room'

type RoomContextValue = {
  roomId: string
  phase: GamePhase
  currentQuizIndex: number
  participants: Participant[]
}

const RoomContext = createContext<RoomContextValue | null>(null)

type RoomProviderProps = {
  roomId: string
  children: React.ReactNode
}

export function RoomProvider({ roomId, children }: RoomProviderProps) {
  const { phase, currentQuizIndex } = useGamePhase(roomId)
  const { participants } = useParticipants(roomId)

  return (
    <RoomContext.Provider value={{ roomId, phase, currentQuizIndex, participants }}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom(): RoomContextValue {
  const ctx = useContext(RoomContext)
  if (!ctx) {
    throw new Error('useRoom must be used within a RoomProvider')
  }
  return ctx
}
