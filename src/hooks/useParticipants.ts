'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Participant } from '@/types/room'

type UseParticipantsReturn = {
  participants: Participant[]
}

export function useParticipants(roomId: string): UseParticipantsReturn {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    const participantsQuery = query(
      collection(db, 'participants'),
      where('room_id', '==', roomId)
    )
    return onSnapshot(participantsQuery, (snapshot) => {
      setParticipants(snapshot.docs.map((item) => item.data() as Participant))
    })
  }, [roomId])

  return { participants }
}
