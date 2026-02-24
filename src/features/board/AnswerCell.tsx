"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types/room";

const CHOICE_LABELS = ["A", "B", "C", "D"] as const;

const LABEL_COLORS = [
  "text-cyan-300 bg-cyan-500/20 border-cyan-500/50",
  "text-lime-300 bg-lime-500/20 border-lime-500/50",
  "text-amber-300 bg-amber-500/20 border-amber-500/50",
  "text-fuchsia-300 bg-fuchsia-500/20 border-fuchsia-500/50",
] as const;

interface AnswerCellProps {
  participant: Participant;
  choiceIndex?: number;
  correctIndex?: number;
  revealed: boolean;
}

export function AnswerCell({
  participant,
  choiceIndex,
  correctIndex,
  revealed,
}: AnswerCellProps) {
  const hasAnswered = choiceIndex !== undefined;
  const isCorrect =
    revealed && hasAnswered && correctIndex !== undefined && choiceIndex === correctIndex;
  const isWrong =
    revealed && hasAnswered && correctIndex !== undefined && choiceIndex !== correctIndex;
  const notAnswered = revealed && !hasAnswered;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        revealed
          ? isCorrect
            ? {
                opacity: 1,
                scale: 1.05,
                backgroundColor: "rgba(239,68,68,0.15)",
                boxShadow: "0 0 28px rgba(239,68,68,0.55), 0 0 8px rgba(239,68,68,0.35)",
              }
            : isWrong || notAnswered
            ? { opacity: 0.2, scale: 0.95, backgroundColor: "rgba(0,0,0,0.3)" }
            : { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.05 }}
      className={[
        "flex flex-col items-center gap-2 p-3 rounded-2xl border",
        "bg-white/[0.04] border-white/10",
        "relative overflow-hidden",
      ].join(" ")}
    >
      {/* Correct glow overlay */}
      {isCorrect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-red-500/10 pointer-events-none"
        />
      )}

      {/* Icon */}
      <span className="text-3xl leading-none select-none">{participant.icon}</span>

      {/* Name */}
      <span className="text-xs font-bold text-white/80 truncate max-w-full text-center leading-tight">
        {participant.name}
      </span>

      {/* Choice badge or pending indicator */}
      {hasAnswered ? (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className={[
            "flex items-center justify-center w-7 h-7 rounded-lg border text-xs font-black",
            LABEL_COLORS[choiceIndex % LABEL_COLORS.length],
          ].join(" ")}
        >
          {CHOICE_LABELS[choiceIndex % CHOICE_LABELS.length]}
        </motion.span>
      ) : (
        <motion.span
          animate={!revealed ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center w-7 h-7 rounded-lg border border-white/20 text-white/30 text-xs font-bold"
        >
          ?
        </motion.span>
      )}

      {/* Correct star badge */}
      {isCorrect && (
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.15 }}
          className="absolute -top-1 -right-1 text-base"
        >
          ★
        </motion.span>
      )}

      {/* Pulse ring when answered but not yet revealed */}
      {!revealed && hasAnswered && (
        <motion.div
          className="absolute inset-0 rounded-2xl border border-cyan-400/50 pointer-events-none"
          animate={{ opacity: [0.6, 0], scale: [1, 1.06] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}
