import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')

export async function POST(request: NextRequest) {
  try {
    const { room_code, password } = await request.json()
    if (!room_code || !password) return NextResponse.json({ error: 'room_code and password are required' }, { status: 400 })

    const snapshot = await adminDb.collection('rooms').where('room_code', '==', room_code).limit(1).get()
    if (snapshot.empty) return NextResponse.json({ error: 'ルームコードが見つかりません' }, { status: 404 })
    const room = snapshot.docs[0].data()
    if (!room.host_password_hash) return NextResponse.json({ error: 'パスワードが設定されていません' }, { status: 400 })
    if (hashPassword(password) !== room.host_password_hash) return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 })

    return NextResponse.json({ valid: true, room_id: snapshot.docs[0].id, host_id: room.host_id, room_code: room.room_code })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
