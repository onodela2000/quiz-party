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
      className="w-full rounded-xl p-5 bg-black/40 border border-yellow-600/30 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500/80 font-serif">
          HISTORY
        </span>
        <span className="text-sm font-black text-yellow-400 font-serif">
          Rate {rate}%
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
              "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black shadow-lg",
              answer.is_correct
                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-300 text-yellow-900 shadow-yellow-500/20"
                : "bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 text-slate-400 shadow-black/30",
            ].join(" ")}
          >
            {answer.is_correct ? "👑" : "✕"}
          </motion.span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-4 text-xs font-serif tracking-wider">
        <span className="text-yellow-100/60">
          Correct <span className="text-yellow-400 font-bold text-sm ml-1">{correctCount}</span>
        </span>
        <span className="text-yellow-100/60">
          Total <span className="text-white font-bold text-sm ml-1">{answers.length}</span>
        </span>
      </div>
    </motion.div>
  )
}
