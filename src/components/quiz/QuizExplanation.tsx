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
        "w-full rounded-xl p-8 md:p-10",
        "bg-[#1e1b4b]/90 backdrop-blur-md",
        "border-2 border-indigo-500/30",
        "shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
        "relative overflow-hidden"
      ].join(" ")}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

      {/* Header label */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <span
          className={[
            "inline-flex items-center px-6 py-1.5 rounded-full",
            "text-sm font-black uppercase tracking-[0.2em] font-serif",
            "bg-indigo-950 border border-indigo-400 text-indigo-200",
            "shadow-lg"
          ].join(" ")}
        >
          Explanation
        </span>
        <div className="h-px flex-1 bg-indigo-500/30" />
      </div>

      {/* Explanation body */}
      <div className="text-lg md:text-xl text-indigo-50 leading-relaxed font-medium font-serif relative z-10">
        <QuizMarkdown content={explanation} />
      </div>
    </motion.div>
  );
}
