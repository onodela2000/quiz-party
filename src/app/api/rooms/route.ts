import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import type { Room } from '@/types/room'

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')

export async function POST(request: NextRequest) {
  try {
    const { title, subtitle, password, room_code, quizzes = [] } = await request.json()
    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })
    if (!password || password.length < 4) return NextResponse.json({ error: 'password must be at least 4 characters' }, { status: 400 })
    if (!room_code || room_code.length < 4 || room_code.length > 32 || !/^[a-zA-Z0-9_-]+$/.test(room_code)) {
      return NextResponse.json({ error: 'invalid room_code' }, { status: 400 })
    }
    const existing = await adminDb.collection('rooms').where('room_code', '==', room_code).limit(1).get()
    if (!existing.empty) return NextResponse.json({ error: 'このルームコードは既に使用されています' }, { status: 409 })

    const roomRef = adminDb.collection('rooms').doc()
    const host_id = crypto.randomUUID()
    const room: Room = {
      id: roomRef.id,
      created_at: new Date().toISOString(),
      current_quiz_index: 0,
      host_id,
      host_password_hash: hashPassword(password),
      room_code,
      status: 'waiting',
      subtitle: subtitle ?? null,
      title,
    }
    const batch = adminDb.batch()
    batch.set(roomRef, room)
    quizzes.forEach((quiz: Record<string, unknown>) => {
      const ref = adminDb.collection('quizzes').doc()
      batch.set(ref, { ...quiz, id: ref.id, room_id: roomRef.id, image_url: quiz.image_url ?? null, explanation_image_url: quiz.explanation_image_url ?? null })
    })
    await batch.commit()
    return NextResponse.json({ room, host_id, room_code }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
