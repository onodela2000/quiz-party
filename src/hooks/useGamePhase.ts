'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { GamePhase } from '@/types/game'

type UseGamePhaseReturn = {
  phase: GamePhase
  currentQuizIndex: number
}

export function useGamePhase(roomId: string): UseGamePhaseReturn {
  const [phase, setPhase] = useState<GamePhase>('waiting')
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0)

  useEffect(() => {
    return onSnapshot(doc(db, 'rooms', roomId), (snapshot) => {
      if (!snapshot.exists()) return
      const room = snapshot.data()
      setPhase(room.status as GamePhase)
      setCurrentQuizIndex(room.current_quiz_index)
    })
  }, [roomId])

  return { phase, currentQuizIndex }
}
