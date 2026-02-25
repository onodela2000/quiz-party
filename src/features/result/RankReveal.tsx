"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Participant } from "@/types/room";
import { AvatarIcon } from "@/components/avatar/AvatarIcon";

interface RankRevealProps {
  participants: Participant[];
  totalToReveal?: number;
}

const RANK_COLORS: Record<number, { badge: string; name: string; score: string; border: string; glow: string }> = {
  1: {
    badge: "bg-yellow-100 border-yellow-400 text-yellow-700",
    name: "text-yellow-200",
    score: "text-yellow-400",
    border: "border-yellow-500/50",
    glow: "shadow-[0_0_28px_rgba(234,179,8,0.25)]",
  },
  2: {
    badge: "bg-slate-200 border-slate-400 text-slate-700",
    name: "text-slate-300",
    score: "text-slate-400",
    border: "border-slate-500/50",
    glow: "shadow-[0_0_20px_rgba(148,163,184,0.2)]",
  },
  3: {
    badge: "bg-amber-200 border-amber-600 text-amber-800",
    name: "text-amber-400",
    score: "text-amber-500",
    border: "border-amber-600/50",
    glow: "shadow-[0_0_20px_rgba(217,119,6,0.2)]",
  },
};

function getRankStyle(rank: number) {
  return (
    RANK_COLORS[rank] ?? {
      badge: "bg-slate-800 border-slate-600 text-slate-400",
      name: "text-slate-400",
      score: "text-slate-500",
      border: "border-slate-800",
      glow: "",
    }
  );
}

function RankCard({
  participant,
  rank,
  delay,
}: {
  participant: Participant;
  rank: number;
  delay: number;
}) {
  const style = getRankStyle(rank);

  return (
    <motion.div
      key={participant.id}
      initial={{ opacity: 0, x: -60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 220,
        damping: 24,
      }}
      className={[
        "flex items-center gap-5 px-5 py-4 rounded-2xl border",
        "bg-black/40 backdrop-blur-sm",
        style.border,
        style.glow,
      ].join(" ")}
    >
      {/* Rank badge */}
      <div
        className={[
          "flex-shrink-0 w-14 h-14 rounded-xl border-2 flex items-center justify-center",
          "font-black text-xl shadow-lg",
          style.badge,
        ].join(" ")}
      >
        {rank}
      </div>

      {/* Icon */}
      <span className="flex-shrink-0 text-4xl leading-none select-none filter drop-shadow-md">
        <AvatarIcon icon={participant.icon} size={40} />
      </span>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className={`font-black text-2xl md:text-3xl truncate ${style.name} drop-shadow-sm`}>
          {participant.name}
        </p>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <motion.p
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className={`font-black text-2xl md:text-3xl tabular-nums ${style.score} drop-shadow-sm`}
        >
          {participant.score.toLocaleString()}
        </motion.p>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">points</p>
      </div>
    </motion.div>
  );
}

export function RankReveal({ participants, totalToReveal = 3 }: RankRevealProps) {
  const sorted = [...participants].sort((a, b) => b.score - a.score);
  const toReveal = sorted.slice(0, totalToReveal);
  const [revealedCount, setRevealedCount] = useState(0);

  // Reveal one by one from lowest rank to highest
  useEffect(() => {
    if (revealedCount >= toReveal.length) return;
    const timer = setTimeout(() => {
      setRevealedCount((prev) => prev + 1);
    }, 1200);
    return () => clearTimeout(timer);
  }, [revealedCount, toReveal.length]);

  // Cards shown in bottom-to-top order (lowest rank first, then count up)
  // We reveal from position totalToReveal down to 1
  const visibleParticipants = toReveal
    .slice(0, revealedCount)
    .reverse(); // show latest revealed at top

  return (
    <div className="w-full space-y-4">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <span className="text-sm font-black uppercase tracking-[0.25em] text-cyan-400">
          順位発表
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </motion.div>

      {/* Cards */}
      <AnimatePresence>
        <div className="space-y-3">
          {visibleParticipants.map((participant, displayIndex) => {
            const rank = toReveal.indexOf(participant) + 1;
            return (
              <RankCard
                key={participant.id}
                participant={participant}
                rank={rank}
                delay={displayIndex * 0.05}
              />
            );
          })}
        </div>
      </AnimatePresence>

      {/* Waiting indicator */}
      {revealedCount < toReveal.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex items-center justify-center gap-2 py-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-indigo-500"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
