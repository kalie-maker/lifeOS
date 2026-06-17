"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import {
  ease,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Staggered list container + item                                    */
/* ------------------------------------------------------------------ */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton — calm transform-only shimmer                             */
/* ------------------------------------------------------------------ */
export function Skeleton({
  className = "",
  rounded = "rounded-lg",
}: {
  className?: string;
  rounded?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`relative overflow-hidden bg-[color-mix(in_srgb,var(--color-border)_55%,transparent)] ${rounded} ${className}`}
    >
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-surface) 75%, transparent), transparent)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.25,
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DrawCheck — the signature "saved" confirmation mark                */
/* ------------------------------------------------------------------ */
export function DrawCheck({
  size = 14,
  strokeWidth = 2.4,
  className = "",
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <motion.path
        d="M4.5 12.5l5 5 10-11"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.42, ease, delay: 0.08 }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Typing indicator — three calm dots (assistant "thinking")          */
/* ------------------------------------------------------------------ */
export function TypingDots() {
  const reduce = useReducedMotion();
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink-3"
          animate={reduce ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.16,
          }}
        />
      ))}
    </div>
  );
}
