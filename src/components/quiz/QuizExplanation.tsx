"use client";

import { motion } from "framer-motion";
import { QuizMarkdown } from "@/components/markdown/QuizMarkdown";

interface QuizExplanationProps {
  explanation: string;
}

export function QuizExplanation({ explanation }: QuizExplanationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={[
        "w-full rounded-2xl p-5 md:p-7",
        "bg-gradient-to-br from-indigo-950/60 to-purple-950/40",
        "border border-indigo-500/30",
        "shadow-[0_0_28px_rgba(99,102,241,0.15)]",
      ].join(" ")}
    >
      {/* Header label */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={[
            "inline-flex items-center px-3 py-1 rounded-full",
            "text-xs font-bold uppercase tracking-[0.18em]",
            "bg-indigo-500/20 border border-indigo-500/50 text-indigo-300",
          ].join(" ")}
        >
          解説
        </span>
      </div>

      {/* Explanation body */}
      <div className="text-base md:text-lg text-slate-200 leading-relaxed">
        <QuizMarkdown content={explanation} />
      </div>
    </motion.div>
  );
}
