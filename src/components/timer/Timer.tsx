"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TimerProps {
  seconds: number;
  onEnd?: () => void;
}

export function Timer({ seconds, onEnd }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onEndRef.current?.();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const isUrgent = remaining <= 3;
  const progress = remaining / seconds;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Circular progress ring */}
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(100,116,139,0.2)"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={isUrgent ? "#ef4444" : "#6366f1"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
          />
        </svg>

        {/* Digit in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={remaining}
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              className={[
                "text-4xl font-black tabular-nums select-none",
                isUrgent ? "text-red-500" : "text-slate-900",
              ].join(" ")}
            >
              {remaining}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Pulse overlay when urgent */}
      {isUrgent && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-500 pointer-events-none"
          animate={{ opacity: [0.8, 0], scale: [1, 1.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
}
