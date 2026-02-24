"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types/room";
import { AnswerCell } from "./AnswerCell";

interface AnswerGridProps {
  participants: Participant[];
  answersMap: Map<string, number>;
  correctIndex: number;
  revealed: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

export function AnswerGrid({
  participants,
  answersMap,
  correctIndex,
  revealed,
}: AnswerGridProps) {
  const answeredCount = [...answersMap.values()].length;
  const totalCount = participants.length;

  return (
    <div className="w-full space-y-4">
      {/* Answer count header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 mb-4">
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-500/80 font-serif">
          Status
        </span>
        <motion.div
          key={answeredCount}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="flex items-baseline gap-2"
        >
          <span className="text-2xl font-black text-white font-serif">{answeredCount}</span>
          <span className="text-sm text-white/40 font-serif">/ {totalCount}</span>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/10 overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-200"
          initial={{ width: 0 }}
          animate={{
            width: totalCount > 0 ? `${(answeredCount / totalCount) * 100}%` : "0%",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Grid of participants */}
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {participants.map((participant) => (
          <motion.div key={participant.id} variants={itemVariants}>
            <AnswerCell
              participant={participant}
              choiceIndex={answersMap.get(participant.id)}
              correctIndex={correctIndex}
              revealed={revealed}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Revealed result banner */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
          className={[
            "flex items-center justify-center gap-4 py-6 px-8 rounded-lg",
            "bg-gradient-to-r from-transparent via-red-900/80 to-transparent",
            "border-y border-red-500/30",
            "relative overflow-hidden"
          ].join(" ")}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20" />
          
          <span className="text-yellow-500 text-3xl">✦</span>
          <div className="flex flex-col items-center">
            <span className="text-xs font-serif text-red-300 tracking-[0.3em] uppercase mb-1">Winners</span>
            <span className="text-2xl font-black text-white font-serif tracking-widest">
              正解者 <span className="text-4xl text-yellow-400 mx-2">{
                participants.filter(
                  (p) => answersMap.get(p.id) === correctIndex
                ).length
              }</span> 名
            </span>
          </div>
          <span className="text-yellow-500 text-3xl">✦</span>
        </motion.div>
      )}
    </div>
  );
}
