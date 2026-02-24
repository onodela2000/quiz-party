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
    <div className="rounded-xl border border-yellow-600/30 bg-black/40 backdrop-blur-md p-8 space-y-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
      {/* 現在のフェーズ */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <h2 className="text-xs font-bold text-yellow-500/80 uppercase tracking-[0.2em]">
          Current Phase
        </h2>
        <PhaseController phase={phase} />
      </div>

      {/* 問題番号 */}
      {(phase === "question" || phase === "reveal") && totalQuizzes > 0 && (
        <motion.div
          key={currentQuizIndex}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-black border border-yellow-600/30 rounded-lg px-6 py-4 shadow-inner"
        >
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Question No.</span>
          <span className="text-2xl font-black text-white tabular-nums">
            <span className="text-yellow-400 text-3xl mr-1">{currentQuizIndex + 1}</span>
            <span className="text-slate-600 text-lg mx-2">/</span>
            <span className="text-slate-400 text-xl">{totalQuizzes}</span>
          </span>
        </motion.div>
      )}

      {/* 操作ボタン */}
      <div className="space-y-4">
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
                className="w-full py-5 text-lg font-black tracking-widest uppercase bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 bg-[length:200%_100%] hover:bg-[100%_0] border-none shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300"
                onClick={handleStartQuiz}
                disabled={totalQuizzes === 0}
              >
                START QUIZ
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
                className="w-full py-5 text-lg font-black tracking-widest uppercase bg-gradient-to-r from-red-800 via-red-600 to-red-800 bg-[length:200%_100%] hover:bg-[100%_0] border-none shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300"
                onClick={handleReveal}
              >
                REVEAL ANSWER
              </Button>
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div
              key="reveal-btns"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {isLastQuiz ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full py-5 text-lg font-black tracking-widest uppercase bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-800 bg-[length:200%_100%] hover:bg-[100%_0] border-none shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
                  onClick={handleShowResult}
                >
                  SHOW RESULT
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full py-5 text-lg font-black tracking-widest uppercase bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 bg-[length:200%_100%] hover:bg-[100%_0] border-none shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300"
                  onClick={handleNextQuestion}
                >
                  NEXT QUESTION
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
              className="flex items-center justify-center py-6"
            >
              <span className="text-yellow-500/80 text-sm font-bold uppercase tracking-[0.3em] border border-yellow-600/30 rounded-lg px-8 py-4 bg-black/20 backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                Game Finished
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
