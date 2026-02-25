import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@/lib/supabase/server'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

interface LoginBody {
  room_code: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json()
    const { room_code, password } = body

    if (!room_code) {
      return NextResponse.json({ error: 'room_code is required' }, { status: 400 })
    }
    if (!password) {
      return NextResponse.json({ error: 'password is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: room, error } = await supabase
      .from('rooms')
      .select('id, host_id, host_password_hash, room_code')
      .eq('room_code', room_code)
      .maybeSingle()

    if (error || !room) {
      return NextResponse.json({ error: 'ルームコードが見つかりません' }, { status: 404 })
    }

    if (!room.host_password_hash) {
      return NextResponse.json({ error: 'パスワードが設定されていません' }, { status: 400 })
    }

    const hash = hashPassword(password)
    if (hash !== room.host_password_hash) {
      return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 })
    }

    return NextResponse.json({
      valid: true,
      room_id: room.id,
      host_id: room.host_id,
      room_code: room.room_code,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
