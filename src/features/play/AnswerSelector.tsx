"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { QuizChoices } from "@/components/quiz/QuizChoices"

interface AnswerSelectorProps {
  quizId: string
  choices: string[]
  participantId: string
  onAnswered: (index: number) => void
}

export function AnswerSelector({
  quizId,
  choices,
  participantId,
  onAnswered,
}: AnswerSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleSelect = async (index: number) => {
    if (isAnswered || isSubmitting) return

    setSelectedIndex(index)
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      await supabase.from("answers").insert({
        quiz_id: quizId,
        participant_id: participantId,
        choice_index: index,
        is_correct: false,
      })

      setIsAnswered(true)
      onAnswered(index)
    } catch (err) {
      console.error("回答の送信に失敗しました:", err)
      setSelectedIndex(undefined)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-3">
      <QuizChoices
        choices={choices}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        disabled={isAnswered || isSubmitting}
      />

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={[
            "w-full py-3 px-4 rounded-xl text-center",
            "bg-indigo-500/20 border border-indigo-400/60",
            "text-indigo-300 font-bold text-sm",
          ].join(" ")}
        >
          回答を送信しました！結果発表をお待ちください
        </motion.div>
      )}
    </div>
  )
}
