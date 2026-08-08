import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { deleteQuery, documentData } from '@/lib/firebase/data'
import type { Quiz } from '@/types/quiz'

export async function GET(request: NextRequest) {
  try {
    const roomId = new URL(request.url).searchParams.get('roomId')
    if (!roomId) return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
    const snapshot = await adminDb.collection('quizzes').where('room_id', '==', roomId).orderBy('order').get()
    return NextResponse.json({ quizzes: snapshot.docs.map((item) => documentData<Quiz>(item)) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.room_id || !body.question || !body.choices) return NextResponse.json({ error: 'room_id, question, and choices are required' }, { status: 400 })
    const ref = adminDb.collection('quizzes').doc()
    const quiz = { ...body, id: ref.id, image_url: body.image_url ?? null, explanation_image_url: body.explanation_image_url ?? null }
    await ref.set(quiz)
    return NextResponse.json({ quiz }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { room_id, quizzes } = await request.json()
    if (!room_id || !Array.isArray(quizzes)) return NextResponse.json({ error: 'room_id and quizzes are required' }, { status: 400 })
    await deleteQuery(adminDb.collection('quizzes').where('room_id', '==', room_id))
    const batch = adminDb.batch()
    const newQuizzes = quizzes.map((quiz: Record<string, unknown>) => {
      const ref = adminDb.collection('quizzes').doc()
      const data = { ...quiz, id: ref.id, room_id, image_url: quiz.image_url ?? null, explanation_image_url: quiz.explanation_image_url ?? null }
      batch.set(ref, data)
      return data
    })
    await batch.commit()
    return NextResponse.json({ quizzes: newQuizzes })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
