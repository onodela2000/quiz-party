"use client";

import { motion } from "framer-motion";
import { AvatarIcon } from "@/components/avatar/AvatarIcon";

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
        "inline-flex items-center gap-3 px-4 py-2 rounded-lg border-2",
        "bg-white/90 shadow-[0_4px_6px_rgba(0,0,0,0.3)]",
        "border-yellow-600/50",
      ].join(" ")}
    >
      <AvatarIcon icon={icon} size={32} />
      <span className="text-sm font-bold tracking-wide truncate max-w-[12rem] text-slate-900 font-serif">
        {name}
      </span>
      {score !== undefined && (
        <span className="ml-2 text-xs font-black text-white tabular-nums bg-slate-900 px-2 py-1 rounded border border-slate-700 font-serif">
          {score.toLocaleString()}
        </span>
      )}
    </motion.div>
  );
}
