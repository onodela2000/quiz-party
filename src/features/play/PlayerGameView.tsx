"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { useRoom } from "@/providers/RoomProvider"
import { AnswerSelector } from "@/features/play/AnswerSelector"
import { PlayerStatus } from "@/features/play/PlayerStatus"
import { QuizCard } from "@/components/quiz/QuizCard"
import { QuizChoices } from "@/components/quiz/QuizChoices"
import { QuizExplanation } from "@/components/quiz/QuizExplanation"
import { ParticipantBadge } from "@/components/badge/ParticipantBadge"
import type { Quiz } from "@/types/quiz"

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json()).then((d) => d.quizzes as Quiz[])

interface PlayerAnswerRecord {
  quizId: string
  choiceIndex: number
  is_correct: boolean
}

export function PlayerGameView() {
  const { roomId, phase, currentQuizIndex, participants } = useRoom()

  const { data: quizzes } = useSWR<Quiz[]>(
    `/api/quizzes?roomId=${roomId}`,
    fetcher
  )

  const [participantId, setParticipantId] = useState<string | null>(null)
  const [answeredQuizIds, setAnsweredQuizIds] = useState<Set<string>>(
    new Set()
  )
  const [answerRecords, setAnswerRecords] = useState<PlayerAnswerRecord[]>([])
  const [selectedIndexMap, setSelectedIndexMap] = useState<
    Record<string, number>
  >({})

  useEffect(() => {
    const id = localStorage.getItem("participantId")
    setParticipantId(id)
  }, [])

  const currentQuiz = quizzes?.[currentQuizIndex] ?? null
  const totalQuizzes = quizzes?.length ?? 0

  const handleAnswered = (index: number) => {
    if (!currentQuiz) return
    setAnsweredQuizIds((prev) => new Set(prev).add(currentQuiz.id))
    setSelectedIndexMap((prev) => ({ ...prev, [currentQuiz.id]: index }))
    setAnswerRecords((prev) => [
      ...prev,
      { quizId: currentQuiz.id, choiceIndex: index, is_correct: false },
    ])
  }

  const hasAnsweredCurrent =
    currentQuiz ? answeredQuizIds.has(currentQuiz.id) : false

  const participant =
    participants.find((p) => p.id === participantId) ?? null

  // Sync is_correct from reveal phase: check if selected answer matches correct_index
  const enrichedAnswers = answerRecords.map((record) => {
    const quiz = quizzes?.find((q) => q.id === record.quizId)
    if (!quiz) return record
    return {
      ...record,
      is_correct: record.choiceIndex === quiz.correct_index,
    }
  })

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f23 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <span className="text-sm font-bold text-white">Quiz King</span>
        </div>
        {participant && (
          <ParticipantBadge
            name={participant.name}
            icon={participant.icon}
            score={participant.score}
          />
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* WAITING phase */}
          {phase === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-5xl mb-4"
                >
                  ⏳
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">
                  ホスト開始待ち
                </h2>
                <p className="text-sm text-slate-400">
                  ホストがクイズを開始するまでお待ちください
                </p>
              </div>

              {participants.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    参加者 ({participants.length}人)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((p) => (
                      <ParticipantBadge
                        key={p.id}
                        name={p.name}
                        icon={p.icon}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* QUESTION phase */}
          {phase === "question" && currentQuiz && (
            <motion.div
              key={`question-${currentQuiz.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <QuizCard
                question={currentQuiz.question}
                questionNumber={currentQuizIndex + 1}
                total={totalQuizzes}
              />

              {participantId && (
                <AnswerSelector
                  quizId={currentQuiz.id}
                  choices={currentQuiz.choices}
                  participantId={participantId}
                  onAnswered={handleAnswered}
                />
              )}

              {!participantId && (
                <p className="text-center text-sm text-slate-400">
                  参加者IDが見つかりません
                </p>
              )}
            </motion.div>
          )}

          {/* REVEAL phase */}
          {phase === "reveal" && currentQuiz && (
            <motion.div
              key={`reveal-${currentQuiz.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <QuizCard
                question={currentQuiz.question}
                questionNumber={currentQuizIndex + 1}
                total={totalQuizzes}
              />

              <QuizChoices
                choices={currentQuiz.choices}
                selectedIndex={
                  hasAnsweredCurrent
                    ? selectedIndexMap[currentQuiz.id]
                    : undefined
                }
                correctIndex={currentQuiz.correct_index}
                disabled
              />

              <QuizExplanation explanation={currentQuiz.explanation} />

              {enrichedAnswers.length > 0 && (
                <PlayerStatus answers={enrichedAnswers} />
              )}
            </motion.div>
          )}

          {/* RESULT phase */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 space-y-6"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-6xl"
              >
                🏆
              </motion.div>

              <div>
                <h2 className="text-3xl font-black text-white mb-2">
                  お疲れ様でした！
                </h2>
                <p className="text-slate-400 text-sm">
                  クイズ終了です。結果を確認してください。
                </p>
              </div>

              {participant && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={[
                    "inline-flex flex-col items-center gap-2 px-8 py-5 rounded-2xl",
                    "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
                    "border border-indigo-400/40",
                    "shadow-[0_0_32px_rgba(99,102,241,0.2)]",
                  ].join(" ")}
                >
                  <span className="text-4xl">{participant.icon}</span>
                  <span className="text-lg font-bold text-white">
                    {participant.name}
                  </span>
                  <div className="text-center">
                    <span className="text-4xl font-black text-indigo-300 tabular-nums">
                      {participant.score.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-400 ml-1">点</span>
                  </div>
                </motion.div>
              )}

              {enrichedAnswers.length > 0 && (
                <PlayerStatus answers={enrichedAnswers} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
