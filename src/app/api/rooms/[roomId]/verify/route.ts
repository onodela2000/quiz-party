import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')

export async function POST(request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const body = await request.json()
    const snapshot = await adminDb.collection('rooms').doc(roomId).get()
    if (!snapshot.exists) return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    const room = snapshot.data()!

    const valid = body.host_id
      ? room.host_id === body.host_id
      : body.room_code
        ? room.room_code === body.room_code
        : body.password
          ? Boolean(room.host_password_hash) && hashPassword(body.password) === room.host_password_hash
          : false
    return valid
      ? NextResponse.json({ valid: true, host_id: room.host_id })
      : NextResponse.json({ valid: false }, { status: 401 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
