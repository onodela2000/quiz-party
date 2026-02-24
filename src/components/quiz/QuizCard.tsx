"use client";

import { motion } from "framer-motion";
import { QuizMarkdown } from "@/components/markdown/QuizMarkdown";

interface QuizCardProps {
  question: string;
  questionNumber: number;
  total: number;
  compact?: boolean;
}

export function QuizCard({ question, questionNumber, total, compact }: QuizCardProps) {
  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={[
        "w-full h-full rounded-sm bg-[#fffbf0]",
        "border-[8px] border-double border-yellow-600/40",
        "shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
        "relative overflow-hidden flex flex-col justify-center",
        compact ? "p-4 md:p-6" : "p-6 md:p-10"
      ].join(" ")}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 pointer-events-none mix-blend-multiply" />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-600/60 rounded-tl-none pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-600/60 rounded-tr-none pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-600/60 rounded-bl-none pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-600/60 rounded-br-none pointer-events-none" />

      {/* Question counter */}
      <div className={`flex items-center justify-center gap-4 relative z-10 ${compact ? 'mb-4' : 'mb-8'}`}>
        <div className="h-px w-12 bg-yellow-600/30" />
        <span className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-800/70 font-serif">
          Question {questionNumber}
        </span>
        <div className="h-px w-12 bg-yellow-600/30" />
      </div>

      {/* Question text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
        className={[
          "font-black text-slate-900 leading-tight relative z-10 text-center font-serif",
          compact ? "text-xl md:text-2xl" : "text-xl md:text-2xl lg:text-3xl"
        ].join(" ")}
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <QuizMarkdown content={question} />
      </motion.div>
      
      {/* Decorative bottom element */}
      <div className={`flex justify-center relative z-10 ${compact ? 'mt-4' : 'mt-8'}`}>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent" />
      </div>
    </motion.div>
  );
}
