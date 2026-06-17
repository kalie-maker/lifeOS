"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { OnboardingProvider } from "./OnboardingProvider";
import { EntitiesProvider } from "./EntitiesProvider";
import { ToastProvider } from "./ToastProvider";

/** App-wide client providers, mounted once in the root layout. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <OnboardingProvider>
        <EntitiesProvider>
          <ToastProvider>{children}</ToastProvider>
        </EntitiesProvider>
      </OnboardingProvider>
    </MotionConfig>
  );
}
