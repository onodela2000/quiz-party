"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/button/Button"
import { useGame } from "@/providers/GameProvider"
import { useRoom } from "@/providers/RoomProvider"
import { PhaseController } from "./PhaseController"
import type { Quiz } from "@/types/quiz"

type Props = {
  quizzes: Quiz[]
}

export function ControlPanel({ quizzes }: Props) {
  const { nextPhase } = useGame()
  const { phase, currentQuizIndex } = useRoom()

  const totalQuizzes = quizzes.length
  const isLastQuiz = currentQuizIndex >= totalQuizzes - 1

  const handleStartQuiz = async () => {
    await nextPhase("question", 0)
  }

  const handleReveal = async () => {
    await nextPhase("reveal", currentQuizIndex)
  }

  const handleNextQuestion = async () => {
    await nextPhase("question", currentQuizIndex + 1)
  }

  const handleShowResult = async () => {
    await nextPhase("result", currentQuizIndex)
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-6">
      {/* 現在のフェーズ */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
          フェーズ
        </h2>
        <PhaseController phase={phase} />
      </div>

      {/* 問題番号 */}
      {(phase === "question" || phase === "reveal") && totalQuizzes > 0 && (
        <motion.div
          key={currentQuizIndex}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2"
        >
          <span className="text-sm text-indigo-300">現在の問題</span>
          <span className="text-sm font-bold text-white">
            {currentQuizIndex + 1} / {totalQuizzes}
          </span>
        </motion.div>
      )}

      {/* 操作ボタン */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {phase === "waiting" && (
            <motion.div
              key="waiting-btn"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleStartQuiz}
                disabled={totalQuizzes === 0}
              >
                クイズ開始
              </Button>
            </motion.div>
          )}

          {phase === "question" && (
            <motion.div
              key="question-btn"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-amber-500 hover:bg-amber-400 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                onClick={handleReveal}
              >
                正解発表
              </Button>
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div
              key="reveal-btns"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {isLastQuiz ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  onClick={handleShowResult}
                >
                  最終結果へ
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleNextQuestion}
                >
                  次の問題へ
                </Button>
              )}
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div
              key="result-badge"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-center py-4"
            >
              <span className="text-white/50 text-sm border border-white/10 rounded-lg px-6 py-3">
                選手権が終了しました
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
