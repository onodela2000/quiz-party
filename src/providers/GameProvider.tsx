'use client'

import { createContext, useContext, useCallback } from 'react'
import type { GamePhase } from '@/types/game'

type GameContextValue = {
  nextPhase: (phase: GamePhase, currentQuizIndex?: number) => Promise<void>
}

const GameContext = createContext<GameContextValue | null>(null)

type GameProviderProps = {
  roomId: string
  children: React.ReactNode
}

export function GameProvider({ roomId, children }: GameProviderProps) {
  const nextPhase = useCallback(
    async (phase: GamePhase, currentQuizIndex?: number) => {
      const body: { status: GamePhase; current_quiz_index?: number } = { status: phase }
      if (currentQuizIndex !== undefined) {
        body.current_quiz_index = currentQuizIndex
      }

      await fetch(`/api/rooms/${roomId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    },
    [roomId]
  )

  return (
    <GameContext.Provider value={{ nextPhase }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return ctx
}
