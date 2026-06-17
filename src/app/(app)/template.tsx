"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * App Router re-mounts `template.tsx` on every navigation, so this gives each
 * screen a calm fade + slight slide on enter — the LifeOS screen transition.
 */
export default function ScreenTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}
