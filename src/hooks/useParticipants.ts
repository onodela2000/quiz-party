'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Participant } from '@/types/room'

type UseParticipantsReturn = {
  participants: Participant[]
}

export function useParticipants(roomId: string): UseParticipantsReturn {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    const supabase = createClient()

    // Fetch initial participants list
    supabase
      .from('participants')
      .select('*')
      .eq('room_id', roomId)
      .then(({ data }) => {
        if (data) {
          setParticipants(data)
        }
      })

    // Subscribe to changes
    const channel = supabase
      .channel(`room-participants:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setParticipants((prev) => [...prev, payload.new as Participant])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'participants',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === (payload.new as Participant).id ? (payload.new as Participant) : p
            )
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'participants',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setParticipants((prev) =>
            prev.filter((p) => p.id !== (payload.old as Participant).id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return { participants }
}
