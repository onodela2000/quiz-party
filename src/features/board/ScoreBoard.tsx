"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types/room";

interface ScoreBoardProps {
  participants: Participant[];
}

const RANK_STYLES: Record<number, { label: string; color: string; glow: string; bg: string }> = {
  1: {
    label: "1st",
    color: "text-yellow-300",
    glow: "shadow-[0_0_18px_rgba(234,179,8,0.45)]",
    bg: "bg-yellow-500/15 border-yellow-500/50",
  },
  2: {
    label: "2nd",
    color: "text-slate-300",
    glow: "shadow-[0_0_12px_rgba(148,163,184,0.35)]",
    bg: "bg-slate-500/15 border-slate-500/40",
  },
  3: {
    label: "3rd",
    color: "text-amber-600",
    glow: "shadow-[0_0_12px_rgba(217,119,6,0.35)]",
    bg: "bg-amber-800/15 border-amber-700/40",
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 26 },
  },
};

export function ScoreBoard({ participants }: ScoreBoardProps) {
  const sorted = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
          Score Board
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <motion.ul
        className="space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sorted.map((participant, index) => {
          const rank = index + 1;
          const rankStyle = RANK_STYLES[rank];

          return (
            <motion.li key={participant.id} variants={rowVariants}>
              <div
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl border",
                  rankStyle
                    ? `${rankStyle.bg} ${rankStyle.glow}`
                    : "bg-white/[0.04] border-white/10",
                ].join(" ")}
              >
                {/* Rank */}
                <span
                  className={[
                    "w-10 text-center font-black text-lg tabular-nums",
                    rankStyle ? rankStyle.color : "text-white/40",
                  ].join(" ")}
                >
                  {rankStyle ? rankStyle.label : `${rank}`}
                </span>

                {/* Icon */}
                <span className="text-2xl leading-none select-none">{participant.icon}</span>

                {/* Name */}
                <span
                  className={[
                    "flex-1 font-bold truncate",
                    rank <= 3 ? "text-white text-base" : "text-white/70 text-sm",
                  ].join(" ")}
                >
                  {participant.name}
                </span>

                {/* Score */}
                <motion.span
                  key={participant.score}
                  initial={{ scale: 1.25, color: "#06b6d4" }}
                  animate={{ scale: 1, color: rank <= 3 ? "#fbbf24" : "#e2e8f0" }}
                  transition={{ duration: 0.4 }}
                  className="font-black text-lg tabular-nums"
                >
                  {participant.score.toLocaleString()}
                </motion.span>

                {/* Neon accent bar for top 3 */}
                {rankStyle && (
                  <div
                    className={[
                      "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
                      rank === 1
                        ? "bg-yellow-400"
                        : rank === 2
                        ? "bg-slate-400"
                        : "bg-amber-600",
                    ].join(" ")}
                  />
                )}
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
