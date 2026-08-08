import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { documentData } from '@/lib/firebase/data'
import type { Room } from '@/types/room'
import type { GamePhase } from '@/types/game'

interface PatchRoomBody {
  status?: GamePhase
  current_quiz_index?: number
  title?: string
  subtitle?: string | null
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const snapshot = await adminDb.collection('rooms').doc(roomId).get()
    if (!snapshot.exists) return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    return NextResponse.json({ room: documentData<Room>(snapshot) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const body: PatchRoomBody = await request.json()
    const updateData: Record<string, unknown> = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.current_quiz_index !== undefined) updateData.current_quiz_index = body.current_quiz_index
    if (body.title !== undefined) updateData.title = body.title
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle

    const ref = adminDb.collection('rooms').doc(roomId)
    await ref.update(updateData)
    return NextResponse.json({ room: documentData<Room>(await ref.get()) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 })
  }
}
