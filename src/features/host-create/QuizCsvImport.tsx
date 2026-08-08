"use client"

import { useRef, useState } from "react"
import type { QuizForm } from "./QuizEditor"
import { parseQuizCsv, QUIZ_CSV_TEMPLATE, readCsvFile } from "@/lib/quiz-csv"

type Props = {
  onImport: (quizzes: QuizForm[]) => void
}

export function QuizCsvImport({ onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imported = parseQuizCsv(await readCsvFile(file))
      onImport(imported)
      setMessage({ type: "success", text: `${imported.length}問を読み込みました` })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "CSVを読み込めませんでした" })
    } finally {
      event.target.value = ""
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob(["\uFEFF", QUIZ_CSV_TEMPLATE], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "quiz-template.csv"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-2 rounded-lg border border-yellow-600/40 bg-yellow-900/20 text-xs font-bold text-yellow-300 hover:bg-yellow-900/35 transition-colors"
        >
          CSVを読み込む
        </button>
        <button
          type="button"
          onClick={downloadTemplate}
          className="px-3 py-2 rounded-lg border border-white/10 text-xs font-bold text-slate-400 hover:text-slate-200 hover:border-white/20 transition-colors"
        >
          ひな形
        </button>
      </div>
      <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
      {message && (
        <p className={`text-xs font-bold ${message.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
