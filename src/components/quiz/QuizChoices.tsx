"use client";

import { motion } from "framer-motion";

interface QuizChoicesProps {
  choices: string[];
  selectedIndex?: number;
  correctIndex?: number;
  onSelect?: (index: number) => void;
  disabled?: boolean;
}

const LABELS = ["A", "B", "C", "D"] as const;

const LABEL_COLORS = [
  { base: "text-blue-200", bg: "bg-gradient-to-br from-blue-900 to-blue-950", border: "border-blue-500/50", shadow: "shadow-blue-900/20" },
  { base: "text-red-200", bg: "bg-gradient-to-br from-red-900 to-red-950", border: "border-red-500/50", shadow: "shadow-red-900/20" },
  { base: "text-green-200", bg: "bg-gradient-to-br from-green-900 to-green-950", border: "border-green-500/50", shadow: "shadow-green-900/20" },
  { base: "text-yellow-200", bg: "bg-gradient-to-br from-yellow-900 to-yellow-950", border: "border-yellow-500/50", shadow: "shadow-yellow-900/20" },
] as const;

function getChoiceStyle(
  index: number,
  selectedIndex: number | undefined,
  correctIndex: number | undefined
): string {
  const base =
    "relative flex items-center gap-4 w-full px-5 py-5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer disabled:cursor-not-allowed font-serif shadow-lg active:scale-[0.98]";

  // After reveal
  if (correctIndex !== undefined) {
    if (index === correctIndex) {
      return `${base} bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)] z-10`;
    }
    if (index === selectedIndex) {
      return `${base} bg-slate-900/80 border-slate-700 opacity-50 grayscale`;
    }
    return `${base} bg-slate-900/60 border-slate-800 opacity-30 grayscale`;
  }

  // Selected (before reveal)
  if (index === selectedIndex) {
    return `${base} bg-gradient-to-r from-yellow-900/80 to-yellow-800/80 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]`;
  }

  // Default
  return `${base} bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } },
};

export function QuizChoices({
  choices,
  selectedIndex,
  correctIndex,
  onSelect,
  disabled,
}: QuizChoicesProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {choices.map((choice, index) => {
        const labelColor = LABEL_COLORS[index % LABEL_COLORS.length];
        const isCorrect = correctIndex !== undefined && index === correctIndex;

        return (
          <motion.div key={index} variants={itemVariants}>
            <button
              className={getChoiceStyle(index, selectedIndex, correctIndex)}
              onClick={() => onSelect?.(index)}
              disabled={disabled || correctIndex !== undefined}
            >
              {/* Label badge */}
              <span
                className={[
                  "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                  "text-lg font-black font-serif shadow-inner border",
                  labelColor.bg,
                  labelColor.border,
                  labelColor.base,
                ].join(" ")}
              >
                {LABELS[index % LABELS.length]}
              </span>

              {/* Choice text */}
              <span className={[
                "flex-1 text-lg md:text-xl font-bold leading-snug tracking-wide",
                correctIndex !== undefined && index === correctIndex ? "text-yellow-100" : "text-slate-200"
              ].join(" ")}>
                {choice}
              </span>

              {/* Correct indicator */}
              {isCorrect && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex-shrink-0 text-3xl filter drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                >
                  👑
                </motion.span>
              )}
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
