import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { Room } from '@/types/room'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

interface CreateRoomBody {
  title: string
  subtitle?: string
  password: string
  quizzes: {
    question: string
    choices: string[]
    correct_index: number
    explanation: string
    image_url?: string
    explanation_image_url?: string
    order: number
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRoomBody = await request.json()
    const { title, subtitle, password, quizzes } = body

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }
    if (!password || password.length < 4) {
      return NextResponse.json({ error: 'password must be at least 4 characters' }, { status: 400 })
    }

    const supabase = await createClient()
    const host_id = crypto.randomUUID()
    const host_token = crypto.randomUUID()
    const host_password_hash = hashPassword(password)
    
    // 30日後の有効期限
    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({ 
        title, 
        subtitle: subtitle ?? null, 
        host_id, 
        host_password_hash,
        host_token,
        expires_at
      })
      .select()
      .single()

    if (roomError || !room) {
      return NextResponse.json(
        { error: roomError?.message ?? 'Failed to create room' },
        { status: 500 }
      )
    }

    if (quizzes && quizzes.length > 0) {
      const quizInserts = quizzes.map((quiz) => ({
        room_id: room.id,
        question: quiz.question,
        choices: quiz.choices,
        correct_index: quiz.correct_index,
        explanation: quiz.explanation,
        image_url: quiz.image_url ?? null,
        explanation_image_url: quiz.explanation_image_url ?? null,
        order: quiz.order,
      }))

      const { error: quizzesError } = await supabase
        .from('quizzes')
        .insert(quizInserts)

      if (quizzesError) {
        return NextResponse.json(
          { error: quizzesError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ room: room as Room, host_id, host_token }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
