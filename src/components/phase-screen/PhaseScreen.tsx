"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GamePhase } from "@/types/game";

interface PhaseScreenProps {
  phase: GamePhase;
  children?: ReactNode;
}

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" as const } },
};

function WaitingScreen() {
  return (
    <motion.div
      key="waiting"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-screen bg-white select-none"
    >
      {/* Animated glow orb */}
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Spinner dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-3 h-3 rounded-full bg-indigo-400"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <p className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          待機中
          <span className="text-indigo-500">...</span>
        </p>
        <p className="text-sm text-slate-400 tracking-widest uppercase">
          Waiting for host
        </p>
      </motion.div>
    </motion.div>
  );
}

export function PhaseScreen({ phase, children }: PhaseScreenProps) {
  if (phase === "waiting") {
    return (
      <AnimatePresence mode="wait">
        <WaitingScreen key="waiting" />
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
