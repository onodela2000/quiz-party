'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { GamePhase } from '@/types/game'

type UseGamePhaseReturn = {
  phase: GamePhase
  currentQuizIndex: number
}

export function useGamePhase(roomId: string): UseGamePhaseReturn {
  const [phase, setPhase] = useState<GamePhase>('waiting')
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0)

  useEffect(() => {
    const supabase = createClient()

    // Fetch initial state
    supabase
      .from('rooms')
      .select('status, current_quiz_index')
      .eq('id', roomId)
      .single()
      .then(({ data }) => {
        const row = data as { status: string; current_quiz_index: number } | null
        if (row) {
          setPhase(row.status as GamePhase)
          setCurrentQuizIndex(row.current_quiz_index)
        }
      })

    // Subscribe to changes
    const channel = supabase
      .channel(`room-phase:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const newRow = payload.new as { status: string; current_quiz_index: number }
          setPhase(newRow.status as GamePhase)
          setCurrentQuizIndex(newRow.current_quiz_index)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return { phase, currentQuizIndex }
}
