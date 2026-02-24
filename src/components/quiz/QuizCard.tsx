"use client";

import { motion } from "framer-motion";
import { QuizMarkdown } from "@/components/markdown/QuizMarkdown";

interface QuizCardProps {
  question: string;
  questionNumber: number;
  total: number;
}

export function QuizCard({ question, questionNumber, total }: QuizCardProps) {
  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={[
        "w-full rounded-2xl p-6 md:p-10",
        "bg-gradient-to-br from-white/5 to-white/[0.02]",
        "border border-white/10",
        "shadow-[0_0_40px_rgba(99,102,241,0.12)]",
      ].join(" ")}
    >
      {/* Question counter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
          Question
        </span>
        <span className="text-xs font-bold text-white/40">
          {questionNumber} / {total}
        </span>
        {/* Progress bar */}
        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden ml-2">
          <motion.div
            className="h-full rounded-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / total) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question number badge */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
        className={[
          "inline-flex items-center justify-center w-14 h-14 mb-4",
          "rounded-2xl bg-indigo-500/20 border border-indigo-500/40",
          "text-2xl font-black text-indigo-300",
          "shadow-[0_0_16px_rgba(99,102,241,0.3)]",
        ].join(" ")}
      >
        {questionNumber}
      </motion.div>

      {/* Question text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
      >
        <QuizMarkdown content={question} />
      </motion.div>
    </motion.div>
  );
}
