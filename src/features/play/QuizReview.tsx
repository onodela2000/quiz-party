"use client"

import { useState } from "react"
import { QuizMarkdown } from "@/components/markdown/QuizMarkdown"
import type { Quiz } from "@/types/quiz"

type AnswerRecord = {
  quizId: string
  choiceIndex: number
}

type Props = {
  quizzes: Quiz[]
  answers: AnswerRecord[]
}

const LABELS = ["A", "B", "C", "D"]

export function QuizReview({ quizzes, answers }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const answerMap = new Map(answers.map((answer) => [answer.quizId, answer.choiceIndex]))

  return (
    <section className="w-full text-left">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="w-full min-h-14 px-5 rounded-xl border border-yellow-600/40 bg-yellow-900/20 text-yellow-200 font-black hover:bg-yellow-900/35 transition-colors flex items-center justify-between"
      >
        <span>問題を振り返る</span>
        <span aria-hidden className="text-xl">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {quizzes.map((quiz, quizIndex) => {
            const selectedIndex = answerMap.get(quiz.id)
            const isCorrect = selectedIndex === quiz.correct_index

            return (
              <article key={quiz.id} className="rounded-xl border border-white/10 bg-black/45 p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black tracking-widest text-yellow-500">第{quizIndex + 1}問</span>
                  <span className={`text-xs font-black px-3 py-1 rounded-full border ${selectedIndex === undefined ? "text-slate-400 border-slate-600" : isCorrect ? "text-emerald-300 border-emerald-500/50 bg-emerald-900/20" : "text-red-300 border-red-500/50 bg-red-900/20"}`}>
                    {selectedIndex === undefined ? "未回答" : isCorrect ? "正解" : "不正解"}
                  </span>
                </div>

                <div className="text-lg font-bold text-white leading-relaxed [&>div]:!text-white [&_strong]:!text-white [&_em]:!text-slate-300 [&_li]:!text-slate-200">
                  <QuizMarkdown content={quiz.question} />
                </div>

                <div className="grid gap-2">
                  {quiz.choices.map((choice, choiceIndex) => {
                    const isAnswer = choiceIndex === quiz.correct_index
                    const isSelected = choiceIndex === selectedIndex
                    return (
                      <div
                        key={choiceIndex}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${isAnswer ? "border-emerald-500/60 bg-emerald-900/25 text-emerald-100" : isSelected ? "border-red-500/50 bg-red-900/20 text-red-100" : "border-white/10 text-slate-400"}`}
                      >
                        <span className="font-black">{LABELS[choiceIndex]}</span>
                        <span className="flex-1">{choice}</span>
                        {isAnswer && <span className="text-xs font-black">正解</span>}
                        {isSelected && !isAnswer && <span className="text-xs font-black">あなたの回答</span>}
                      </div>
                    )
                  })}
                </div>

                {quiz.explanation && (
                  <div className="rounded-lg border border-indigo-500/25 bg-indigo-900/20 p-4">
                    <p className="mb-2 text-xs font-black tracking-widest text-indigo-300">解説</p>
                    <div className="text-sm leading-relaxed text-indigo-100/90 [&>div]:!text-indigo-100 [&_strong]:!text-white [&_em]:!text-indigo-200 [&_li]:!text-indigo-100">
                      <QuizMarkdown content={quiz.explanation} />
                    </div>
                  </div>
                )}
                {quiz.explanation_image_url && (
                  <img src={quiz.explanation_image_url} alt="解説画像" className="max-h-72 w-full rounded-lg object-contain bg-black/30" />
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
