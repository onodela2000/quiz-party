import type { DocumentSnapshot, Query } from 'firebase-admin/firestore'
import { adminDb } from './admin'

export function documentData<T>(snapshot: DocumentSnapshot): T {
  return { id: snapshot.id, ...snapshot.data() } as T
}

export async function deleteQuery(query: Query): Promise<void> {
  const snapshot = await query.get()
  if (snapshot.empty) return

  const batch = adminDb.batch()
  snapshot.docs.forEach((item) => batch.delete(item.ref))
  await batch.commit()
}
