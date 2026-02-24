export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      answers: {
        Row: {
          answered_at: string
          choice_index: number
          id: string
          is_correct: boolean
          participant_id: string
          quiz_id: string
        }
        Insert: {
          answered_at?: string
          choice_index: number
          id?: string
          is_correct: boolean
          participant_id: string
          quiz_id: string
        }
        Update: {
          answered_at?: string
          choice_index?: number
          id?: string
          is_correct?: boolean
          participant_id?: string
          quiz_id?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
          room_id: string
          score: number
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          name: string
          room_id: string
          score?: number
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
          room_id?: string
          score?: number
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          choices: Json
          correct_index: number
          explanation: string
          id: string
          image_url: string | null
          order: number
          question: string
          room_id: string
        }
        Insert: {
          choices: Json
          correct_index: number
          explanation?: string
          id?: string
          image_url?: string | null
          order?: number
          question: string
          room_id: string
        }
        Update: {
          choices?: Json
          correct_index?: number
          explanation?: string
          id?: string
          image_url?: string | null
          order?: number
          question?: string
          room_id?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string
          current_quiz_index: number
          host_id: string
          id: string
          status: string
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string
          current_quiz_index?: number
          host_id: string
          id?: string
          status?: string
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string
          current_quiz_index?: number
          host_id?: string
          id?: string
          status?: string
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 便利なエイリアス
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
