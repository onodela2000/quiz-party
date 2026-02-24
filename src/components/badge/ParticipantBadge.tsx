"use client";

import { motion } from "framer-motion";

interface ParticipantBadgeProps {
  name: string;
  icon: string;
  score?: number;
}

export function ParticipantBadge({ name, icon, score }: ParticipantBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-white/5 border border-cyan-500/40",
        "shadow-[0_0_10px_rgba(6,182,212,0.25)]",
        "text-white backdrop-blur-sm",
      ].join(" ")}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-sm font-semibold tracking-wide truncate max-w-[10rem]">
        {name}
      </span>
      {score !== undefined && (
        <span className="ml-1 text-xs font-bold text-cyan-400 tabular-nums">
          {score.toLocaleString()}
        </span>
      )}
    </motion.div>
  );
}
