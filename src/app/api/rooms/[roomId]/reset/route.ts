import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const supabase = await createClient()

    // 1. Delete answers first (FK: answers.participant_id → participants.id)
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('id')
      .eq('room_id', roomId)

    if (quizzes && quizzes.length > 0) {
      const quizIds = quizzes.map((q) => q.id)
      const { error: answersError } = await supabase
        .from('answers')
        .delete()
        .in('quiz_id', quizIds)

      if (answersError) {
        return NextResponse.json(
          { error: answersError.message },
          { status: 500 }
        )
      }
    }

    // 2. Delete participants (now safe — no answers reference them)
    const { error: participantsError } = await supabase
      .from('participants')
      .delete()
      .eq('room_id', roomId)

    if (participantsError) {
      return NextResponse.json(
        { error: participantsError.message },
        { status: 500 }
      )
    }

    // 3. Reset room status to waiting and quiz index to 0
    const { error: roomError } = await supabase
      .from('rooms')
      .update({ status: 'waiting', current_quiz_index: 0 })
      .eq('id', roomId)

    if (roomError) {
      return NextResponse.json(
        { error: roomError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
