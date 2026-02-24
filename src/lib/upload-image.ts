import { createClient } from "@/lib/supabase/client"

export async function uploadQuizImage(file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split(".").pop() ?? "png"
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from("quiz-images")
    .upload(path, file, { cacheControl: "3600", upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from("quiz-images").getPublicUrl(path)
  return data.publicUrl
}
