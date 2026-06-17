"use client";

import { motion } from "motion/react";

/** Calm holding screen shown while the onboarding status resolves. */
export function Splash() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg">
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-display text-2xl text-ink"
      >
        LifeOS
      </motion.span>
      <motion.span
        aria-hidden
        className="mt-4 h-1 w-1 rounded-full bg-ink-3"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
