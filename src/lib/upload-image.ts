export async function uploadQuizImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.set('file', file)

  const response = await fetch('/api/uploads', { method: 'POST', body: formData })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? '画像のアップロードに失敗しました')
  return data.url
}
