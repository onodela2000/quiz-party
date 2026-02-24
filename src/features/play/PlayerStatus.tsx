"use client"

import { motion } from "framer-motion"

interface PlayerStatusProps {
  answers: { is_correct: boolean }[]
}

export function PlayerStatus({ answers }: PlayerStatusProps) {
  if (answers.length === 0) return null

  const correctCount = answers.filter((a) => a.is_correct).length
  const rate = Math.round((correctCount / answers.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full rounded-2xl p-4 bg-white/[0.04] border border-white/10"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          あなたの回答履歴
        </span>
        <span className="text-sm font-bold text-cyan-400">
          正解率 {rate}%
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {answers.map((answer, index) => (
          <motion.span
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              delay: index * 0.05,
            }}
            className={[
              "inline-flex items-center justify-center w-8 h-8 rounded-full text-base font-bold",
              answer.is_correct
                ? "bg-green-500/20 border border-green-400/60 text-green-300"
                : "bg-red-500/20 border border-red-400/60 text-red-300",
            ].join(" ")}
          >
            {answer.is_correct ? "○" : "✕"}
          </motion.span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span>
          <span className="text-green-400 font-bold">{correctCount}</span> 正解
        </span>
        <span>
          <span className="text-red-400 font-bold">
            {answers.length - correctCount}
          </span>{" "}
          不正解
        </span>
        <span>合計 {answers.length} 問</span>
      </div>
    </motion.div>
  )
}
