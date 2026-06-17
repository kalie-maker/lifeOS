"use client";

import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";

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
  // Lock background scroll while a sheet is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isBottom = side === "bottom";

  return (
    <div className="absolute inset-0 z-40 flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="los-fade-in absolute inset-0 bg-[rgba(26,24,20,0.32)] backdrop-blur-[1px]"
      />

      {/* Panel */}
      <div
        className={
          isBottom
            ? "los-sheet-up absolute inset-x-0 bottom-0 flex flex-col rounded-t-[22px] border-t border-border bg-surface shadow-[0_-12px_40px_rgba(26,24,20,0.16)]"
            : "los-fade-in absolute inset-y-0 right-0 flex w-[86%] max-w-[360px] translate-x-0 flex-col border-l border-border bg-surface shadow-[-12px_0_40px_rgba(26,24,20,0.18)]"
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
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-bg"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
