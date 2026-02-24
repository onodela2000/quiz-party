"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types/room";

const CHOICE_LABELS = ["A", "B", "C", "D"] as const;

const LABEL_COLORS = [
  "text-blue-900 bg-gradient-to-br from-blue-200 to-blue-400 border-blue-500 shadow-lg",
  "text-red-900 bg-gradient-to-br from-red-200 to-red-400 border-red-500 shadow-lg",
  "text-green-900 bg-gradient-to-br from-green-200 to-green-400 border-green-500 shadow-lg",
  "text-yellow-900 bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-500 shadow-lg",
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
                scale: 1.15,
                zIndex: 20,
              }
            : isWrong || notAnswered
            ? { opacity: 0.4, scale: 0.85, filter: "grayscale(100%)" }
            : { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="relative group"
    >
      {/* Frame container */}
      <div className={[
        "flex flex-col items-center gap-2 p-3 pb-4 rounded-lg border-4 transition-all duration-500",
        isCorrect 
          ? "bg-gradient-to-b from-yellow-100 to-white border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.6)]" 
          : "bg-[#1a1a1a] border-[#333] shadow-md",
      ].join(" ")}>
        
        {/* Decorative corner accents for correct answer */}
        {isCorrect && (
          <>
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-yellow-600 rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-yellow-600 rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-yellow-600 rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-yellow-600 rounded-br-lg" />
          </>
        )}

        {/* Icon */}
        <div className="relative">
          <span className="text-4xl leading-none select-none filter drop-shadow-md">{participant.icon}</span>
          {isCorrect && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-4 -right-4 text-2xl drop-shadow-md"
            >
              👑
            </motion.div>
          )}
        </div>

        {/* Name */}
        <span className={[
          "text-xs font-bold truncate max-w-full text-center leading-tight tracking-wide font-serif",
          isCorrect ? "text-yellow-900" : "text-gray-400"
        ].join(" ")}>
          {participant.name}
        </span>

        {/* Choice badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          {hasAnswered ? (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className={[
                "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-black font-serif shadow-lg",
                LABEL_COLORS[choiceIndex % LABEL_COLORS.length],
              ].join(" ")}
            >
              {CHOICE_LABELS[choiceIndex % CHOICE_LABELS.length]}
            </motion.div>
          ) : (
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-600 bg-gray-800 text-gray-400 text-sm font-bold font-serif"
            >
              ?
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
