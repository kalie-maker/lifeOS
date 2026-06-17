"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Icon, type IconName } from "./ui/Icon";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/inicio", label: "Inicio", icon: "home" },
  { href: "/calendario", label: "Calendario", icon: "calendar" },
  { href: "/capturar", label: "Capturar", icon: "plus" },
  { href: "/espacios", label: "Espacios", icon: "spaces" },
  { href: "/persona", label: "Persona", icon: "user" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[440px] items-stretch justify-between px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const isCapture = item.href === "/capturar";

          if (isCapture) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label="Capturar"
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <motion.span
                  whileTap={{ scale: 0.92 }}
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
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-1"
            >
              <motion.span
                whileTap={{ scale: 0.9 }}
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
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
