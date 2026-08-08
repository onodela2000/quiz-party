import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function getCredential() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!serviceAccount) return applicationDefault()

  return cert(JSON.parse(serviceAccount))
}

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: getCredential(),
      projectId: 'quiz-party-jp',
      storageBucket: 'quiz-party-jp.firebasestorage.app',
    })

export const adminDb = getFirestore(adminApp)
export const adminBucket = getStorage(adminApp).bucket()
