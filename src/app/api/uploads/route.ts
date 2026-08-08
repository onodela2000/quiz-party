import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { adminBucket } from '@/lib/firebase/admin'

const MAX_FILE_SIZE = 4 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: '画像ファイルが必要です' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'JPEG、PNG、GIF、WebPのみアップロードできます' }, { status: 400 })
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '画像サイズは4MB以下にしてください' }, { status: 400 })
    }

    const token = randomUUID()
    const path = `quiz-images/${randomUUID()}.${EXTENSIONS[file.type]}`
    await adminBucket.file(path).save(Buffer.from(await file.arrayBuffer()), {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    })

    const url = `https://firebasestorage.googleapis.com/v0/b/${adminBucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`
    return NextResponse.json({ url }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '画像のアップロードに失敗しました' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
