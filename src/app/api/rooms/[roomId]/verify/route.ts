import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@/lib/supabase/server'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

interface VerifyBody {
  host_id?: string
  password?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const body: VerifyBody = await request.json()

    const supabase = await createClient()
    const { data: room, error } = await supabase
      .from('rooms')
      .select('host_id, host_password_hash')
      .eq('id', roomId)
      .single()

    if (error || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Verify by host_id token
    if (body.host_id) {
      if (room.host_id === body.host_id) {
        return NextResponse.json({ valid: true, host_id: room.host_id })
      }
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    // Verify by password
    if (body.password) {
      if (!room.host_password_hash) {
        return NextResponse.json({ error: 'This room has no password set' }, { status: 400 })
      }
      const hash = hashPassword(body.password)
      if (hash === room.host_password_hash) {
        return NextResponse.json({ valid: true, host_id: room.host_id })
      }
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ error: 'host_id or password required' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
