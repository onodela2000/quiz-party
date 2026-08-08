"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { QuizChoices } from "@/components/quiz/QuizChoices"

interface AnswerSelectorProps {
  quizId: string
  choices: string[]
  participantId: string
  submittedIndex?: number
  onAnswered: (index: number) => void
}

export function AnswerSelector({
  quizId,
  choices,
  participantId,
  submittedIndex,
  onAnswered,
}: AnswerSelectorProps) {
  const [pendingIndex, setPendingIndex] = useState<number | undefined>(submittedIndex)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditing) setPendingIndex(submittedIndex)
  }, [isEditing, submittedIndex])

  const handleSelect = (index: number) => {
    if (isSubmitting) return
    setPendingIndex(index)
  }

  const handleConfirm = async () => {
    if (pendingIndex === undefined || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const answerId = `${quizId}_${participantId}`
      await setDoc(doc(db, "answers", answerId), {
        id: answerId,
        answered_at: new Date().toISOString(),
        quiz_id: quizId,
        participant_id: participantId,
        choice_index: pendingIndex,
        is_correct: false,
      })

      onAnswered(pendingIndex)
      setIsEditing(false)
    } catch (err) {
      console.error("回答の送信に失敗しました:", err)
      setSubmitError("回答を送信できませんでした。通信状態を確認してもう一度お試しください")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canConfirm = pendingIndex !== undefined && pendingIndex !== submittedIndex
  const hasSubmitted = submittedIndex !== undefined
  const choicesDisabled = isSubmitting || (hasSubmitted && !isEditing)

  const handlePrimaryAction = () => {
    if (hasSubmitted && !isEditing) {
      setIsEditing(true)
      return
    }
    void handleConfirm()
  }

  return (
    <div className="w-full space-y-3">
      <QuizChoices
        choices={choices}
        selectedIndex={pendingIndex}
        onSelect={handleSelect}
        disabled={choicesDisabled}
      />

      <button
        type="button"
        onClick={handlePrimaryAction}
        disabled={isSubmitting || (isEditing && !canConfirm) || (!hasSubmitted && !canConfirm)}
        className={[
          "w-full py-4 rounded-xl font-bold text-lg tracking-widest uppercase transition-all duration-200",
          (hasSubmitted && !isEditing) || canConfirm
            ? "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 text-black shadow-[0_4px_15px_rgba(234,179,8,0.3)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)] hover:-translate-y-0.5"
            : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed",
        ].join(" ")}
      >
        {isSubmitting ? "送信中..." : hasSubmitted && !isEditing ? "回答を変更する" : isEditing ? "変更を確定する" : "回答を決定する"}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={() => {
            setPendingIndex(submittedIndex)
            setIsEditing(false)
          }}
          className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors"
        >
          変更をやめる
        </button>
      )}

      {hasSubmitted && !isEditing && (
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
          回答済み：選択肢 {String.fromCharCode(65 + submittedIndex)}
        </motion.div>
      )}

      {isEditing && (
        <p className="text-center text-sm font-bold text-yellow-200/80">
          新しい選択肢を選んでから「変更を確定する」を押してください
        </p>
      )}

      {submitError && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-3 text-center text-sm font-bold text-red-300">
          {submitError}
        </p>
      )}
    </div>
  )
}
