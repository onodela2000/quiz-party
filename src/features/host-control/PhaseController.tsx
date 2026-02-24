"use client"

import { motion } from "framer-motion"
import type { GamePhase } from "@/types/game"

type Props = {
  phase: GamePhase
}

const PHASE_LABELS: Record<GamePhase, string> = {
  waiting: "STAND BY",
  question: "QUESTION",
  reveal: "REVEAL",
  result: "RESULT",
}

const PHASE_STYLES: Record<GamePhase, string> = {
  waiting:
    "bg-slate-800/60 text-slate-400 border-slate-600 shadow-inner",
  question:
    "bg-red-900/40 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse",
  reveal:
    "bg-yellow-900/40 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
  result:
    "bg-emerald-900/40 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
}

export function PhaseController({ phase }: Props) {
  return (
    <motion.span
      key={phase}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={[
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black border tracking-[0.2em] uppercase shadow-lg backdrop-blur-sm",
        PHASE_STYLES[phase],
      ].join(" ")}
    >
      <span
        className={[
          "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
          phase === "waiting" ? "bg-slate-500" :
          phase === "question" ? "bg-red-500" :
          phase === "reveal" ? "bg-yellow-500" :
          "bg-emerald-500",
        ].join(" ")}
      />
      {PHASE_LABELS[phase]}
    </motion.span>
  )
}
