"use client";

import { useApp } from "@/state/AppContext";
import type { ModuleId } from "@/state/types";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";

const moduleIcon: Record<ModuleId, IconName> = {
  casa: "house",
  coche: "car",
  mascotas: "paw",
  familia: "family",
  persona: "heart",
};

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const icon = toast.module ? moduleIcon[toast.module] : "check";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[84px] z-50 flex justify-center px-4">
      <div
        key={toast.id}
        className="los-scale-in relative flex items-center gap-2.5 rounded-2xl border border-border bg-ink px-4 py-3 text-sm font-medium text-white shadow-[0_8px_30px_rgba(26,24,20,0.28)]"
      >
        {/* flowing module glyphs */}
        {toast.module && (
          <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute text-white/80"
                style={{
                  left: `${(i - 1) * 16}px`,
                  animation: `los-flow 1.2s ease-out ${i * 0.18}s both`,
                }}
              >
                <Icon name={icon} size={14} />
              </span>
            ))}
          </span>
        )}
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
          <Icon name="check" size={13} strokeWidth={2.2} />
        </span>
        {toast.message}
      </div>
    </div>
  );
}
