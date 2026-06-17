"use client";

import { AnimatePresence, motion } from "motion/react";
import { useToast } from "@/components/ToastProvider";
import { DrawCheck } from "./motion";
import { scaleIn } from "@/lib/motion";

export function Toast() {
  const { toast } = useToast();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[84px] z-50 flex justify-center px-4">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-2.5 rounded-2xl border border-border bg-ink px-4 py-3 text-sm font-medium text-white shadow-[0_8px_30px_rgba(26,24,20,0.28)]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
              <DrawCheck size={13} strokeWidth={2.2} />
            </span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
