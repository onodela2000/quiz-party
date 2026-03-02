"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types/room";
import { AvatarIcon } from "@/components/avatar/AvatarIcon";
import { computeRanks } from "@/lib/ranking";

interface ScoreBoardProps {
  participants: Participant[];
}

const RANK_STYLES: Record<number, { label: string; color: string; glow: string; bg: string; border: string }> = {
  1: {
    label: "KING",
    color: "text-yellow-900",
    glow: "shadow-[0_0_40px_rgba(234,179,8,0.5)]",
    bg: "bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200",
    border: "border-yellow-500",
  },
  2: {
    label: "QUEEN",
    color: "text-slate-800",
    glow: "shadow-[0_0_30px_rgba(148,163,184,0.4)]",
    bg: "bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300",
    border: "border-slate-400",
  },
  3: {
    label: "JACK",
    color: "text-amber-900",
    glow: "shadow-[0_0_30px_rgba(217,119,6,0.4)]",
    bg: "bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300",
    border: "border-amber-600",
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
  const ranks = computeRanks(sorted);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
        <span className="px-6 py-2 text-xl font-black uppercase tracking-[0.3em] text-yellow-500 font-serif border-y border-yellow-500/30">
          Ranking
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
      </div>

      <motion.ul
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sorted.map((participant, index) => {
          const rank = ranks[index];
          const rankStyle = RANK_STYLES[rank];

          return (
            <motion.li key={participant.id} variants={rowVariants}>
              <div
                className={[
                  "flex items-center gap-6 px-6 py-4 rounded-xl border-2 transition-all duration-300",
                  rankStyle
                    ? `${rankStyle.bg} ${rankStyle.glow} ${rankStyle.border}`
                    : "bg-black/40 border-white/10 hover:bg-black/60",
                ].join(" ")}
              >
                {/* Rank Badge */}
                <div className={[
                  "w-16 h-16 flex items-center justify-center rounded-full border-4 font-black text-xl italic font-serif shadow-inner",
                  rankStyle 
                    ? "bg-white/50 border-white/50 " + rankStyle.color
                    : "bg-slate-800 border-slate-600 text-slate-500"
                ].join(" ")}>
                  {rankStyle ? (
                    <span className="text-xs">{rankStyle.label}</span>
                  ) : (
                    rank
                  )}
                </div>

                {/* Icon */}
                <AvatarIcon icon={participant.icon} size={48} />

                {/* Name */}
                <span
                  className={[
                    "flex-1 font-bold truncate tracking-wide font-serif text-xl",
                    rankStyle ? rankStyle.color : "text-slate-400",
                  ].join(" ")}
                >
                  {participant.name}
                </span>

                {/* Score */}
                <div className="flex flex-col items-end">
                  <span className={[
                    "text-xs font-bold uppercase tracking-wider mb-1",
                    rankStyle ? rankStyle.color : "text-slate-600"
                  ].join(" ")}>Score</span>
                  <motion.span
                    key={participant.score}
                    initial={{ scale: 1.25 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={[
                      "font-black text-3xl tabular-nums font-serif",
                      rankStyle ? rankStyle.color : "text-slate-300"
                    ].join(" ")}
                  >
                    {participant.score.toLocaleString()}
                  </motion.span>
                </div>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
