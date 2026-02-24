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
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-bold uppercase tracking-widest text-white/50">
          回答状況
        </span>
        <motion.span
          key={answeredCount}
          initial={{ scale: 1.3, color: "#06b6d4" }}
          animate={{ scale: 1, color: "#ffffff" }}
          transition={{ duration: 0.35 }}
          className="text-lg font-black tabular-nums text-white"
        >
          <span className="text-cyan-400">{answeredCount}</span>
          <span className="text-white/40 text-sm font-semibold"> / {totalCount}</span>
          <span className="ml-2 text-sm font-semibold text-white/60">人回答済み</span>
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
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
            "flex items-center justify-center gap-3 py-3 px-5 rounded-xl",
            "bg-red-500/10 border border-red-500/40",
            "shadow-[0_0_24px_rgba(239,68,68,0.2)]",
          ].join(" ")}
        >
          <span className="text-red-400 text-2xl">★</span>
          <span className="text-base font-bold text-red-300">
            正解者:{" "}
            {
              participants.filter(
                (p) => answersMap.get(p.id) === correctIndex
              ).length
            }{" "}
            名
          </span>
          <span className="text-red-400 text-2xl">★</span>
        </motion.div>
      )}
    </div>
  );
}
