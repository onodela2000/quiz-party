export type Room = {
  id: string
  created_at: string
  current_quiz_index: number
  host_id: string
  host_password_hash: string | null
  room_code: string | null
  status: string
  subtitle: string | null
  title: string
}

export type Participant = {
  id: string
  created_at: string
  icon: string
  name: string
  room_id: string
  score: number
}

export type Quiz = {
  id: string
  room_id: string
  question: string
  choices: string[]
  correct_index: number
  explanation: string
  explanation_image_url: string | null
  image_url: string | null
  order: number
}

export type Answer = {
  id: string
  answered_at: string
  choice_index: number
  is_correct: boolean
  participant_id: string
  quiz_id: string
}
