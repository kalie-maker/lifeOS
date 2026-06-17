"use client";

import { AnimatePresence, motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import type { ModuleId } from "@/state/types";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { DrawCheck } from "./motion";
import { scaleIn } from "@/lib/motion";

const moduleIcon: Record<ModuleId, IconName> = {
  casa: "house",
  coche: "car",
  mascotas: "paw",
  familia: "family",
  persona: "heart",
};

export function Toast() {
  const { toast } = useApp();
  const icon = toast?.module ? moduleIcon[toast.module] : "check";

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
            className="relative flex items-center gap-2.5 rounded-2xl border border-border bg-ink px-4 py-3 text-sm font-medium text-white shadow-[0_8px_30px_rgba(26,24,20,0.28)]"
          >
            {/* module glyphs flowing toward the toast */}
            {toast.module && (
              <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute text-white/80"
                    style={{ left: `${(i - 1) * 16}px` }}
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 1, 0], y: -46, scale: 1 }}
                    transition={{
                      duration: 1.2,
                      ease: "easeOut",
                      delay: i * 0.18,
                    }}
                  >
                    <Icon name={icon} size={14} />
                  </motion.span>
                ))}
              </span>
            )}
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
