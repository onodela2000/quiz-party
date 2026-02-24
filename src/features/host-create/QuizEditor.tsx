"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/button/Button"

export type QuizForm = {
  question: string
  choices: string[]
  correct_index: number
  explanation: string
}

type Props = {
  index: number
  quiz: QuizForm
  onChange: (quiz: QuizForm) => void
  onRemove: () => void
}

const CHOICE_LABELS = ["A", "B", "C", "D"] as const

export function QuizEditor({ index, quiz, onChange, onRemove }: Props) {
  const handleQuestion = (value: string) => {
    onChange({ ...quiz, question: value })
  }

  const handleChoice = (i: number, value: string) => {
    const next = [...quiz.choices]
    next[i] = value
    onChange({ ...quiz, choices: next })
  }

  const handleCorrectIndex = (value: number) => {
    onChange({ ...quiz, correct_index: value })
  }

  const handleExplanation = (value: string) => {
    onChange({ ...quiz, explanation: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase">
          Q{index + 1}
        </span>
        <Button variant="danger" size="sm" onClick={onRemove} type="button">
          削除
        </Button>
      </div>

      {/* 問題文 */}
      <div className="space-y-1">
        <label className="block text-sm text-white/60">
          問題文 <span className="text-xs text-white/30">（Markdown 対応）</span>
        </label>
        <textarea
          value={quiz.question}
          onChange={(e) => handleQuestion(e.target.value)}
          rows={3}
          placeholder="問題文を入力してください..."
          className="w-full rounded-lg bg-black/40 border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder-white/20 px-3 py-2 text-sm resize-y transition-colors"
        />
      </div>

      {/* 選択肢 */}
      <div className="space-y-2">
        <label className="block text-sm text-white/60">選択肢</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHOICE_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={[
                  "flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold border",
                  quiz.correct_index === i
                    ? "bg-indigo-500 border-indigo-400 text-white"
                    : "bg-white/5 border-white/10 text-white/50",
                ].join(" ")}
              >
                {label}
              </span>
              <input
                type="text"
                value={quiz.choices[i] ?? ""}
                onChange={(e) => handleChoice(i, e.target.value)}
                placeholder={`選択肢 ${label}`}
                className="flex-1 rounded-lg bg-black/40 border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder-white/20 px-3 py-1.5 text-sm transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 正解選択 */}
      <div className="space-y-1">
        <label className="block text-sm text-white/60">正解</label>
        <div className="flex gap-3 flex-wrap">
          {CHOICE_LABELS.map((label, i) => (
            <label key={label} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={`correct-${index}`}
                value={i}
                checked={quiz.correct_index === i}
                onChange={() => handleCorrectIndex(i)}
                className="accent-indigo-500"
              />
              <span className="text-sm text-white/70">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 解説 */}
      <div className="space-y-1">
        <label className="block text-sm text-white/60">解説</label>
        <textarea
          value={quiz.explanation}
          onChange={(e) => handleExplanation(e.target.value)}
          rows={2}
          placeholder="解説を入力してください..."
          className="w-full rounded-lg bg-black/40 border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder-white/20 px-3 py-2 text-sm resize-y transition-colors"
        />
      </div>
    </motion.div>
  )
}
