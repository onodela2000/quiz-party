import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Quiz } from '@/types/quiz'

interface CreateQuizBody {
  room_id: string
  question: string
  choices: string[]
  correct_index: number
  explanation: string
  image_url?: string
  order: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select()
      .eq('room_id', roomId)
      .order('order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ quizzes: (quizzes ?? []) as Quiz[] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateQuizBody = await request.json()
    const {
      room_id,
      question,
      choices,
      correct_index,
      explanation,
      image_url,
      order,
    } = body

    if (!room_id || !question || !choices) {
      return NextResponse.json(
        { error: 'room_id, question, and choices are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert({
        room_id,
        question,
        choices,
        correct_index,
        explanation,
        image_url: image_url ?? null,
        order,
      })
      .select()
      .single()

    if (error || !quiz) {
      return NextResponse.json(
        { error: error?.message ?? 'Failed to create quiz' },
        { status: 500 }
      )
    }

    return NextResponse.json({ quiz: quiz as Quiz }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
