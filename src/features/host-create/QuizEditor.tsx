"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { uploadQuizImage } from "@/lib/upload-image"

export type QuizForm = {
  question: string
  choices: string[]
  correct_index: number
  explanation: string
  image_url?: string
  explanation_image_url?: string
}

type Props = {
  index: number
  quiz: QuizForm
  onChange: (quiz: QuizForm) => void
  onRemove: () => void
  onPreview: () => void
}

const CHOICE_LABELS = ["A", "B", "C", "D"] as const

function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (url: string | undefined) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadQuizImage(file)
      onChange(url)
    } catch {
      alert("画像のアップロードに失敗しました")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wider px-2 py-0.5 rounded hover:bg-red-900/20 transition-colors"
          >
            削除
          </button>
        )}
      </div>

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/20">
          <img src={value} alt="" className="w-full max-h-48 object-contain" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-3 rounded-lg border border-dashed border-white/15 text-slate-500 hover:text-slate-400 hover:border-white/25 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {uploading ? "アップロード中..." : "+ 画像を追加"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}

export function QuizEditor({ index, quiz, onChange, onRemove, onPreview }: Props) {
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
      className="rounded-xl border border-yellow-600/30 bg-black/40 backdrop-blur-md p-6 space-y-6 shadow-lg"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <span className="text-sm font-black text-yellow-500 tracking-widest uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-xs">Q</span>
          第{index + 1}問
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            type="button"
            className="text-xs font-bold text-yellow-400/70 hover:text-yellow-300 uppercase tracking-wider px-3 py-1 rounded hover:bg-yellow-900/20 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={onRemove}
            type="button"
            className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider px-3 py-1 rounded hover:bg-red-900/20 transition-colors"
          >
            削除
          </button>
        </div>
      </div>

      {/* 問題文 */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          問題文 <span className="text-[10px] text-slate-500 ml-1">(Markdown対応)</span>
        </label>
        <textarea
          value={quiz.question}
          onChange={(e) => handleQuestion(e.target.value)}
          rows={3}
          placeholder="問題文を入力してください..."
          className="w-full rounded-lg bg-black/40 border border-white/10 focus:border-yellow-500/50 focus:outline-none text-white placeholder-slate-600 px-4 py-3 text-base resize-y transition-colors font-sans"
        />
      </div>

      {/* 問題画像 */}
      <ImageUpload
        label="問題画像"
        value={quiz.image_url}
        onChange={(url) => onChange({ ...quiz, image_url: url })}
      />

      {/* 選択肢 */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">選択肢 <span className="text-[10px] text-slate-500 ml-1">(左のボタンで正解を選択)</span></label>
        <div className="grid grid-cols-1 gap-3">
          {CHOICE_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <label className="relative flex-shrink-0 cursor-pointer group">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  value={i}
                  checked={quiz.correct_index === i}
                  onChange={() => handleCorrectIndex(i)}
                  className="peer appearance-none w-10 h-10 rounded-lg border-2 border-slate-700 checked:border-yellow-400 bg-slate-800 checked:bg-yellow-500 transition-all cursor-pointer shadow-sm checked:shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-500 peer-checked:text-black transition-colors">
                  {label}
                </span>
              </label>
              <input
                type="text"
                value={quiz.choices[i] ?? ""}
                onChange={(e) => handleChoice(i, e.target.value)}
                placeholder={`選択肢 ${label}`}
                className="flex-1 rounded-lg bg-black/40 border border-white/10 focus:border-yellow-500/50 focus:outline-none text-white placeholder-slate-600 px-4 py-2.5 text-sm transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 解説 */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">解説</label>
        <textarea
          value={quiz.explanation}
          onChange={(e) => handleExplanation(e.target.value)}
          rows={2}
          placeholder="解説を入力してください..."
          className="w-full rounded-lg bg-black/40 border border-white/10 focus:border-yellow-500/50 focus:outline-none text-white placeholder-slate-600 px-4 py-3 text-sm resize-y transition-colors font-sans"
        />
      </div>

      {/* 解説画像 */}
      <ImageUpload
        label="解説画像"
        value={quiz.explanation_image_url}
        onChange={(url) => onChange({ ...quiz, explanation_image_url: url })}
      />
    </motion.div>
  )
}
