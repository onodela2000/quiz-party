"use client"

import { motion } from "framer-motion"
import type { GamePhase } from "@/types/game"

type Props = {
  phase: GamePhase
}

const PHASE_LABELS: Record<GamePhase, string> = {
  waiting: "待機中",
  question: "出題中",
  reveal: "正解発表",
  result: "最終結果",
}

const PHASE_STYLES: Record<GamePhase, string> = {
  waiting:
    "bg-white/10 text-white/70 border-white/20",
  question:
    "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.3)]",
  reveal:
    "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
  result:
    "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
}

export function PhaseController({ phase }: Props) {
  return (
    <motion.span
      key={phase}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide uppercase",
        PHASE_STYLES[phase],
      ].join(" ")}
    >
      <span
        className={[
          "w-1.5 h-1.5 rounded-full",
          phase === "waiting" ? "bg-white/50" :
          phase === "question" ? "bg-indigo-400 animate-pulse" :
          phase === "reveal" ? "bg-amber-400" :
          "bg-emerald-400",
        ].join(" ")}
      />
      {PHASE_LABELS[phase]}
    </motion.span>
  )
}
