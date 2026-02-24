import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Room } from '@/types/room'
import { GamePhase } from '@/types/game'

interface PatchRoomBody {
  status?: GamePhase
  current_quiz_index?: number
  title?: string
  subtitle?: string | null
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const supabase = await createClient()

    const { data: room, error } = await supabase
      .from('rooms')
      .select()
      .eq('id', roomId)
      .single()

    if (error || !room) {
      return NextResponse.json(
        { error: error?.message ?? 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ room: room as Room })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const body: PatchRoomBody = await request.json()
    const { status, current_quiz_index, title, subtitle } = body

    const updateData: { status?: string; current_quiz_index?: number; title?: string; subtitle?: string | null } = {}
    if (status !== undefined) updateData.status = status
    if (current_quiz_index !== undefined) updateData.current_quiz_index = current_quiz_index
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle

    const supabase = await createClient()

    const { data: room, error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId)
      .select()
      .single()

    if (error || !room) {
      return NextResponse.json(
        { error: error?.message ?? 'Failed to update room' },
        { status: 500 }
      )
    }

    return NextResponse.json({ room: room as Room })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
