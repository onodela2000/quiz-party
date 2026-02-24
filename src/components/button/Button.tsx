"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-indigo-500 hover:bg-indigo-400 text-white border border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]",
  ghost:
    "bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/60",
  danger:
    "bg-red-600 hover:bg-red-500 text-white border border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-base rounded-lg",
  lg: "px-8 py-4 text-xl rounded-xl font-bold tracking-wide",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  whileTap,
  whileHover,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={whileTap ?? { scale: 0.94 }}
      whileHover={whileHover ?? { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center cursor-pointer select-none transition-colors duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
