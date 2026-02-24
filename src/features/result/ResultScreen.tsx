"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types/room";
import { Podium } from "./Podium";
import { RankReveal } from "./RankReveal";

interface ResultScreenProps {
  participants: Participant[];
}

export function ResultScreen({ participants }: ResultScreenProps) {
  const sorted = [...participants].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-white relative overflow-hidden"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 space-y-10">
        {/* Podium */}
        <Podium participants={sorted} />

        {/* Rank reveal */}
        <RankReveal participants={sorted} totalToReveal={3} />
      </div>
    </motion.div>
  );
}
