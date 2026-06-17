"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

/**
 * The persistent app shell: a centred, mobile-first device frame with the
 * bottom navigation. Page content (animated per-route via template.tsx)
 * is rendered inside the scrollable <main>.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#ECEAE5] sm:p-6">
        <div className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-bg sm:h-[880px] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[44px] sm:border sm:border-[#dcd8d1] sm:shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
          <main className="absolute inset-0 overflow-y-auto pt-[max(8px,env(safe-area-inset-top))] pb-[96px]">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </MotionConfig>
  );
}
