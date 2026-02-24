"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types/room";
import { Podium } from "./Podium";
import { RankReveal } from "./RankReveal";

interface ResultScreenProps {
  participants: Participant[];
  title?: string;
  subtitle?: string | null;
}

export function ResultScreen({ participants, title, subtitle }: ResultScreenProps) {
  const sorted = [...participants].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full relative overflow-hidden font-serif text-white"
      style={{ background: "radial-gradient(ellipse at center, #450a0a 0%, #1a0303 100%)" }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none" />
      
      {/* Spotlights */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-1/2 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Title Section */}
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-3"
          >
            {title && (
              <h1 className="text-2xl md:text-4xl font-black text-yellow-100/90 tracking-widest drop-shadow-md border-b-2 border-yellow-600/30 inline-block pb-2 px-8">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg text-yellow-500/80 font-bold uppercase tracking-[0.2em]">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Podium */}
        <Podium participants={sorted} />

        {/* Rank reveal */}
        <RankReveal participants={sorted} totalToReveal={3} />
      </div>
    </motion.div>
  );
}
