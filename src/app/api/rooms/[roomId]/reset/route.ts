import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { deleteQuery } from '@/lib/firebase/data'

export async function POST(_request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const quizzes = await adminDb.collection('quizzes').where('room_id', '==', roomId).get()
    await Promise.all(quizzes.docs.map((quiz) => deleteQuery(adminDb.collection('answers').where('quiz_id', '==', quiz.id))))
    await deleteQuery(adminDb.collection('participants').where('room_id', '==', roomId))
    await adminDb.collection('rooms').doc(roomId).update({ status: 'waiting', current_quiz_index: 0 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
