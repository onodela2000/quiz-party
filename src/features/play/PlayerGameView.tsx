"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { AvatarIcon } from "@/components/avatar/AvatarIcon"
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

export function PlayerGameView({ title }: { title: string }) {
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
    setAnswerRecords((prev) => {
      const existing = prev.findIndex((r) => r.quizId === currentQuiz.id)
      if (existing !== -1) {
        const updated = [...prev]
        updated[existing] = { quizId: currentQuiz.id, choiceIndex: index, is_correct: false }
        return updated
      }
      return [...prev, { quizId: currentQuiz.id, choiceIndex: index, is_correct: false }]
    })
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
      className="min-h-screen flex flex-col font-serif text-white"
      style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-600/30 bg-black/40 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl filter drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">👑</span>
          <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 tracking-widest uppercase">
            {title || "Quiz King"}
          </span>
        </div>
        {participant && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900/20 border border-yellow-600/40">
            <AvatarIcon icon={participant.icon} size={28} className="rounded-md" />
            <span className="text-xs font-bold text-yellow-100/90">{participant.name}</span>
            <span className="text-xs font-black text-yellow-400 ml-1">{participant.score}pt</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 w-full max-w-6xl mx-auto relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* WAITING phase */}
          {phase === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-lg mx-auto w-full"
            >
              {/* ... existing waiting content ... */}
              <div className="text-center py-10 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/10 to-transparent blur-xl" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="text-6xl mb-6 filter drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                >
                  ⏳
                </motion.div>
                <h2 className="text-2xl font-black text-yellow-100 mb-3 tracking-widest">
                  STAND BY
                </h2>
                <p className="text-xs text-yellow-500/60 uppercase tracking-[0.2em]">
                  Waiting for host to start
                </p>
              </div>

              {participants.length > 0 && (
                <div className="space-y-4 bg-black/20 p-6 rounded-xl border border-white/5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600/80 text-center border-b border-white/5 pb-2">
                    Challengers ({participants.length})
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {participants.map((p) => (
                      <div key={p.id} className="relative group">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-yellow-600/30 flex items-center justify-center text-xl shadow-lg">
                          <AvatarIcon icon={p.icon} size={32} />
                        </div>
                      </div>
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            >
              <div className="w-full">
                <QuizCard
                  question={currentQuiz.question}
                  questionNumber={currentQuizIndex + 1}
                  total={totalQuizzes}
                  imageUrl={currentQuiz.image_url}
                />
              </div>

              <div className="w-full flex flex-col justify-center h-full space-y-4 lg:pt-8">
                {participantId ? (
                  <AnswerSelector
                    quizId={currentQuiz.id}
                    choices={currentQuiz.choices}
                    participantId={participantId}
                    onAnswered={handleAnswered}
                  />
                ) : (
                  <p className="text-center text-sm text-red-400 bg-red-900/20 py-2 rounded">
                    Player ID not found
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* REVEAL phase */}
          {phase === "reveal" && currentQuiz && (
            <motion.div
              key={`reveal-${currentQuiz.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            >
              <div className="w-full space-y-6">
                <QuizCard
                  question={currentQuiz.question}
                  questionNumber={currentQuizIndex + 1}
                  total={totalQuizzes}
                  imageUrl={currentQuiz.image_url}
                />
                
                {/* Mobile only explanation position */}
                <div className="lg:hidden">
                  <QuizExplanation explanation={currentQuiz.explanation} imageUrl={currentQuiz.explanation_image_url} />
                </div>
              </div>

              <div className="w-full space-y-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-b from-yellow-500/5 to-transparent rounded-xl pointer-events-none" />
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
                </div>

                {/* Desktop only explanation position */}
                <div className="hidden lg:block">
                  <QuizExplanation explanation={currentQuiz.explanation} imageUrl={currentQuiz.explanation_image_url} />
                </div>

                {enrichedAnswers.length > 0 && (
                  <PlayerStatus answers={enrichedAnswers} />
                )}
              </div>
            </motion.div>
          )}

          {/* RESULT phase */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 space-y-8 max-w-lg mx-auto w-full"
            >
              {/* ... existing result content ... */}
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, -5, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ delay: 0.3, duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-7xl filter drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]"
              >
                🏆
              </motion.div>

              <div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 mb-2 tracking-tight">
                  FINISH
                </h2>
                <p className="text-yellow-500/60 text-xs uppercase tracking-[0.3em]">
                  Check your result
                </p>
              </div>

              {participant && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={[
                    "relative overflow-hidden inline-flex flex-col items-center gap-3 px-10 py-8 rounded-2xl",
                    "bg-gradient-to-br from-black/60 to-slate-900/60",
                    "border border-yellow-600/40",
                    "shadow-[0_0_50px_rgba(0,0,0,0.5)]",
                  ].join(" ")}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                  
                  <div className="w-20 h-20 rounded-full border-2 border-yellow-500/50 flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(234,179,8,0.2)] bg-black/40">
                    <AvatarIcon icon={participant.icon} size={80} className="rounded-xl" />
                  </div>
                  <span className="text-xl font-bold text-yellow-100 tracking-wide">
                    {participant.name}
                  </span>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-xs text-yellow-600 font-bold uppercase tracking-widest mb-1">Total Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-yellow-400 tabular-nums drop-shadow-md">
                        {participant.score.toLocaleString()}
                      </span>
                      <span className="text-sm text-yellow-600 font-bold">pt</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {enrichedAnswers.length > 0 && (
                <div className="px-4">
                  <PlayerStatus answers={enrichedAnswers} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
