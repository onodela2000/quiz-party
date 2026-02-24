"use client";

import { motion } from "framer-motion";
import { QuizMarkdown } from "@/components/markdown/QuizMarkdown";

interface QuizExplanationProps {
  explanation: string;
  imageUrl?: string | null;
}

export function QuizExplanation({ explanation, imageUrl }: QuizExplanationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={[
        "w-full rounded-sm p-8 md:p-12",
        "bg-[#fffbf0]",
        "border-[6px] border-double border-yellow-600/40",
        "shadow-[0_0_50px_rgba(0,0,0,0.8)]",
        "relative overflow-hidden"
      ].join(" ")}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 pointer-events-none mix-blend-multiply" />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-600/60 rounded-tl-none pointer-events-none" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-yellow-600/60 rounded-tr-none pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-yellow-600/60 rounded-bl-none pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-600/60 rounded-br-none pointer-events-none" />

      {/* Header label */}
      <div className="flex items-center justify-center gap-4 mb-8 relative z-10">
        <div className="h-px w-16 bg-yellow-600/30" />
        <span
          className={[
            "inline-flex items-center px-6 py-2",
            "text-base font-black uppercase tracking-[0.3em] font-serif text-yellow-900",
            "border-y-2 border-yellow-600/20"
          ].join(" ")}
        >
          Explanation
        </span>
        <div className="h-px w-16 bg-yellow-600/30" />
      </div>

      {/* Explanation body */}
      <div className="text-lg md:text-xl text-slate-900 leading-relaxed font-medium font-serif relative z-10">
        <QuizMarkdown content={explanation} />
      </div>

      {/* Explanation image */}
      {imageUrl && (
        <div className="flex justify-center mt-6 relative z-10">
          <img src={imageUrl} alt="" className="max-h-64 rounded-lg shadow-md object-contain" />
        </div>
      )}
    </motion.div>
  );
}
