"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types/room";
import { AvatarIcon } from "@/components/avatar/AvatarIcon";

interface PodiumProps {
  participants: Participant[];
}

// Confetti/sparkle particle
function SparkleParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.span
      className="absolute text-xl pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0],
        y: [-20, -60, -90],
        rotate: [0, 30, -20, 0],
      }}
      transition={{
        duration: 1.8,
        delay,
        repeat: Infinity,
        repeatDelay: 2.5,
        ease: "easeOut",
      }}
    >
      {["★", "✦", "◆", "✸", "⬟"][Math.floor((delay * 7) % 5)]}
    </motion.span>
  );
}

const SPARKLE_POSITIONS = [
  { x: 10, y: 80, delay: 0 },
  { x: 25, y: 60, delay: 0.3 },
  { x: 50, y: 90, delay: 0.6 },
  { x: 70, y: 65, delay: 0.15 },
  { x: 85, y: 78, delay: 0.45 },
  { x: 40, y: 55, delay: 0.9 },
  { x: 60, y: 50, delay: 1.2 },
  { x: 15, y: 45, delay: 0.75 },
  { x: 90, y: 55, delay: 0.5 },
  { x: 35, y: 70, delay: 1.05 },
];

const PODIUM_ORDER = [1, 0, 2]; // render order: 2nd, 1st, 3rd

const PODIUM_CONFIG = [
  // 1st place (index 0)
  {
    height: "h-36",
    delay: 0.5,
    label: "1st",
    labelColor: "text-yellow-600",
    glow: "shadow-[0_0_40px_rgba(234,179,8,0.6),0_0_80px_rgba(234,179,8,0.25)]",
    bg: "bg-gradient-to-b from-yellow-500/30 to-yellow-700/20 border-yellow-500/60",
    crown: true,
    textSize: "text-5xl",
    badgeSize: "w-20 h-20",
    iconSize: "text-4xl",
    nameSize: "text-xl",
    scoreSize: "text-2xl",
    order: 2,
  },
  // 2nd place (index 1)
  {
    height: "h-24",
    delay: 0.2,
    label: "2nd",
    labelColor: "text-slate-600",
    glow: "shadow-[0_0_24px_rgba(148,163,184,0.4)]",
    bg: "bg-gradient-to-b from-slate-500/25 to-slate-700/15 border-slate-400/50",
    crown: false,
    textSize: "text-4xl",
    badgeSize: "w-16 h-16",
    iconSize: "text-3xl",
    nameSize: "text-base",
    scoreSize: "text-xl",
    order: 1,
  },
  // 3rd place (index 2)
  {
    height: "h-16",
    delay: 0.8,
    label: "3rd",
    labelColor: "text-amber-600",
    glow: "shadow-[0_0_20px_rgba(217,119,6,0.35)]",
    bg: "bg-gradient-to-b from-amber-800/25 to-amber-900/15 border-amber-700/50",
    crown: false,
    textSize: "text-3xl",
    badgeSize: "w-14 h-14",
    iconSize: "text-2xl",
    nameSize: "text-sm",
    scoreSize: "text-lg",
    order: 3,
  },
];

export function Podium({ participants }: PodiumProps) {
  // participants is assumed to be sorted by score descending
  const top3 = participants.slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div className="relative w-full flex flex-col items-center py-8 overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Sparkle particles */}
      {SPARKLE_POSITIONS.map((pos, i) => (
        <SparkleParticle key={i} x={pos.x} y={pos.y} delay={pos.delay} />
      ))}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className="relative z-10 text-4xl md:text-6xl font-black tracking-tight text-center mb-16"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          FINAL RESULT
        </span>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          <span className="text-yellow-100/60 text-lg font-serif tracking-[0.3em] uppercase">Top 3 Players</span>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        </div>
      </motion.h2>

      {/* Podium stage */}
      <div className="relative z-10 flex items-end justify-center gap-2 md:gap-6 w-full max-w-3xl px-4">
        {PODIUM_ORDER.map((rankIndex) => {
          const participant = top3[rankIndex];
          if (!participant) return null;
          const config = PODIUM_CONFIG[rankIndex];

          return (
            <motion.div
              key={participant.id}
              className="flex flex-col items-center gap-3"
              style={{ order: config.order }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: config.delay,
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
            >
              {/* Crown for 1st */}
              {config.crown && (
                <motion.span
                  initial={{ scale: 0, rotate: -30, y: 20 }}
                  animate={{ scale: 1, rotate: 0, y: 0 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 12 }}
                  className="text-6xl select-none filter drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"
                >
                  👑
                </motion.span>
              )}

              {/* Player badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: config.delay + 0.2, type: "spring", stiffness: 260, damping: 20 }}
                className={[
                  "flex items-center justify-center rounded-2xl border-4 shadow-2xl relative z-10",
                  config.badgeSize,
                  config.glow,
                  rankIndex === 0
                    ? "border-yellow-400 bg-black/60"
                    : rankIndex === 1
                    ? "border-slate-300 bg-black/60"
                    : "border-amber-600 bg-black/60",
                ].join(" ")}
              >
                <AvatarIcon icon={participant.icon} size={parseInt(config.badgeSize.replace(/\D/g, "")) - 8} />
              </motion.div>

              {/* Name */}
              <span
                className={`font-black text-white text-center leading-tight tracking-wide drop-shadow-md ${config.nameSize}`}
              >
                {participant.name}
              </span>

              {/* Score */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: config.delay + 0.4 }}
                className={`font-black tabular-nums ${config.scoreSize} ${config.labelColor} drop-shadow-sm`}
              >
                {participant.score.toLocaleString()}
                <span className="text-xs font-bold text-white/50 ml-1">pt</span>
              </motion.span>

              {/* Podium block */}
              <motion.div
                className={[
                  "w-24 md:w-40 rounded-t-lg border-x-2 border-t-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                  config.height,
                  config.bg,
                  "flex items-center justify-center relative overflow-hidden backdrop-blur-sm",
                ].join(" ")}
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: config.delay,
                  type: "spring",
                  stiffness: 150,
                  damping: 24,
                }}
                style={{ transformOrigin: "bottom" }}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay" />
                <span
                  className={`font-black ${config.textSize} ${config.labelColor} select-none drop-shadow-md relative z-10`}
                >
                  {config.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
