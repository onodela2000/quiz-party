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
  const [pendingIndex, setPendingIndex] = useState<number | undefined>(undefined)
  const [submittedIndex, setSubmittedIndex] = useState<number | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelect = (index: number) => {
    if (isSubmitting) return
    setPendingIndex(index)
  }

  const handleConfirm = async () => {
    if (pendingIndex === undefined || isSubmitting) return
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      await supabase.from("answers").upsert({
        quiz_id: quizId,
        participant_id: participantId,
        choice_index: pendingIndex,
        is_correct: false,
      }, { onConflict: "quiz_id,participant_id" })

      setSubmittedIndex(pendingIndex)
      onAnswered(pendingIndex)
    } catch (err) {
      console.error("回答の送信に失敗しました:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canConfirm = pendingIndex !== undefined && pendingIndex !== submittedIndex

  return (
    <div className="w-full space-y-3">
      <QuizChoices
        choices={choices}
        selectedIndex={pendingIndex}
        onSelect={handleSelect}
        disabled={isSubmitting}
      />

      <button
        onClick={handleConfirm}
        disabled={!canConfirm || isSubmitting}
        className={[
          "w-full py-4 rounded-xl font-bold text-lg tracking-widest uppercase transition-all duration-200",
          canConfirm
            ? "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 text-black shadow-[0_4px_15px_rgba(234,179,8,0.3)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)] hover:-translate-y-0.5"
            : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed",
        ].join(" ")}
      >
        {isSubmitting ? "送信中..." : submittedIndex !== undefined ? "変更する" : "決定"}
      </button>

      {submittedIndex !== undefined && (
        <motion.div
          key={submittedIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={[
            "w-full py-3 px-4 rounded-xl text-center",
            "bg-indigo-500/20 border border-indigo-400/60",
            "text-indigo-300 font-bold text-sm",
          ].join(" ")}
        >
          回答済み — 変更する場合は別の選択肢を選んでください
        </motion.div>
      )}
    </div>
  )
}
