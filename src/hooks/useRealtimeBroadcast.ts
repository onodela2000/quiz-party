'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

type BroadcastCallback = (payload: Record<string, unknown>) => void

export function useRealtimeBroadcast(channelName: string) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const listenersRef = useRef<Map<string, BroadcastCallback[]>>(new Map())

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(channelName)

    // Register all accumulated listeners before subscribing
    listenersRef.current.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        channel.on(
          'broadcast',
          { event },
          (msg: { event: string; payload: Record<string, unknown> }) => {
            callback(msg.payload)
          }
        )
      })
    })

    channel.subscribe()
    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [channelName])

  const send = useCallback(
    async (event: string, payload: Record<string, unknown>) => {
      const channel = channelRef.current
      if (!channel) return
      await channel.send({
        type: 'broadcast',
        event,
        payload,
      })
    },
    []
  )

  const on = useCallback(
    (event: string, callback: BroadcastCallback) => {
      const existing = listenersRef.current.get(event) ?? []
      listenersRef.current.set(event, [...existing, callback])

      // If channel is already subscribed, attach listener immediately
      const channel = channelRef.current
      if (channel) {
        channel.on(
          'broadcast',
          { event },
          (msg: { event: string; payload: Record<string, unknown> }) => {
            callback(msg.payload)
          }
        )
      }
    },
    []
  )

  return { send, on }
}
