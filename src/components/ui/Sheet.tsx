"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./Icon";
import {
  backdropVariants,
  sheetBottomVariants,
  sheetRightVariants,
} from "@/lib/motion";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "bottom" | "right";
  /** height for bottom sheets, e.g. "80%", "90%", "auto" */
  height?: string;
  title?: string;
  /** optional element rendered on the right of the header */
  headerRight?: ReactNode;
}

export function Sheet({
  open,
  onClose,
  children,
  side = "bottom",
  height = "auto",
  title,
  headerRight,
}: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isBottom = side === "bottom";

  return (
    <AnimatePresence>
      {open && [
        <motion.button
          key="backdrop"
          aria-label="Cerrar"
          onClick={onClose}
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 z-40 bg-[rgba(26,24,20,0.34)] backdrop-blur-[3px]"
        />,
        <motion.div
          key="panel"
          role="dialog"
          aria-modal="true"
          variants={isBottom ? sheetBottomVariants : sheetRightVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={
            isBottom
              ? "absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-[22px] border-t border-border bg-surface shadow-[0_-12px_40px_rgba(26,24,20,0.16)]"
              : "absolute inset-y-0 right-0 z-40 flex w-[86%] max-w-[360px] flex-col border-l border-border bg-surface shadow-[-12px_0_40px_rgba(26,24,20,0.18)]"
          }
          style={isBottom ? { maxHeight: "92%", height } : undefined}
        >
          {isBottom && (
            <div className="flex justify-center pt-3 pb-1">
              <span className="h-1 w-9 rounded-full bg-border" />
            </div>
          )}

          {(title || !isBottom) && (
            <div className="flex items-center justify-between px-5 pt-3 pb-2">
              <h2 className="font-display text-xl text-ink">{title}</h2>
              <div className="flex items-center gap-1">
                {headerRight}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-bg"
                >
                  <Icon name="close" size={18} />
                </motion.button>
              </div>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </motion.div>,
      ]}
    </AnimatePresence>
  );
}
