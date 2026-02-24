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
  { base: "text-cyan-300", bg: "bg-cyan-500/20", border: "border-cyan-500/50" },
  { base: "text-lime-300", bg: "bg-lime-500/20", border: "border-lime-500/50" },
  {
    base: "text-amber-300",
    bg: "bg-amber-500/20",
    border: "border-amber-500/50",
  },
  {
    base: "text-fuchsia-300",
    bg: "bg-fuchsia-500/20",
    border: "border-fuchsia-500/50",
  },
] as const;

function getChoiceStyle(
  index: number,
  selectedIndex: number | undefined,
  correctIndex: number | undefined
): string {
  const base =
    "relative flex items-center gap-4 w-full px-5 py-4 rounded-xl border text-left transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed";

  // After reveal
  if (correctIndex !== undefined) {
    if (index === correctIndex) {
      return `${base} bg-green-500/20 border-green-400/70 shadow-[0_0_16px_rgba(34,197,94,0.3)]`;
    }
    if (index === selectedIndex) {
      return `${base} bg-white/5 border-white/10 opacity-50`;
    }
    return `${base} bg-white/[0.02] border-white/5 opacity-30`;
  }

  // Selected (before reveal)
  if (index === selectedIndex) {
    return `${base} bg-indigo-500/30 border-indigo-400/80 shadow-[0_0_16px_rgba(99,102,241,0.35)]`;
  }

  // Default
  return `${base} bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/25`;
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
      className="grid grid-cols-1 md:grid-cols-2 gap-3"
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
                  "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                  "text-sm font-black",
                  labelColor.bg,
                  labelColor.border,
                  "border",
                  labelColor.base,
                ].join(" ")}
              >
                {LABELS[index % LABELS.length]}
              </span>

              {/* Choice text */}
              <span className="flex-1 text-base md:text-lg font-semibold text-white leading-snug">
                {choice}
              </span>

              {/* Correct indicator */}
              {isCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex-shrink-0 text-green-400 text-2xl"
                >
                  ✓
                </motion.span>
              )}
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
