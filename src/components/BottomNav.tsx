"use client";

import { motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import type { Tab } from "@/state/types";
import { Icon, type IconName } from "./ui/Icon";

const items: { tab: Tab; label: string; icon: IconName }[] = [
  { tab: "inicio", label: "Inicio", icon: "home" },
  { tab: "calendario", label: "Calendario", icon: "calendar" },
  { tab: "capturar", label: "Capturar", icon: "plus" },
  { tab: "espacios", label: "Espacios", icon: "spaces" },
  { tab: "persona", label: "Persona", icon: "user" },
];

export function BottomNav() {
  const { tab, setTab } = useApp();

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[440px] items-stretch justify-between px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => {
          const active = tab === item.tab;
          const isCapture = item.tab === "capturar";

          if (isCapture) {
            return (
              <motion.button
                key={item.tab}
                onClick={() => setTab(item.tab)}
                whileTap={{ scale: 0.92 }}
                className="flex flex-1 flex-col items-center gap-1"
                aria-label="Capturar"
              >
                <motion.span
                  animate={{ scale: active ? 1.06 : 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_4px_14px_rgba(27,58,107,0.35)] ${
                    active ? "bg-accent-2" : "bg-accent"
                  }`}
                >
                  <Icon name="plus" size={24} strokeWidth={2} />
                </motion.span>
                <span
                  className={`text-[10px] tracking-wide ${
                    active ? "text-accent" : "text-ink-3"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.tab}
              onClick={() => setTab(item.tab)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-1 flex-col items-center gap-1 py-1"
              aria-current={active ? "page" : undefined}
            >
              <motion.span
                animate={{ scale: active ? 1.1 : 1, y: active ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className={`transition-colors duration-200 ${
                  active ? "text-accent" : "text-ink-3"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={23}
                  strokeWidth={active ? 1.9 : 1.6}
                />
              </motion.span>
              <span
                className={`text-[10px] tracking-wide transition-colors duration-200 ${
                  active ? "text-accent font-medium" : "text-ink-3"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
