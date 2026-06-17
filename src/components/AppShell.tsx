"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useOnboarding } from "./OnboardingProvider";
import { DeviceFrame } from "./DeviceFrame";
import { BottomNav } from "./BottomNav";
import { Splash } from "./Splash";
import { Toast } from "./ui/Toast";

/**
 * The persistent app shell. Gates the app behind onboarding: a brand-new user
 * (no saved data) is redirected to /onboarding; otherwise the app is shown.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { status } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (status === "new") router.replace("/onboarding");
  }, [status, router]);

  if (status !== "done") {
    return (
      <DeviceFrame>
        <Splash />
      </DeviceFrame>
    );
  }

  return (
    <DeviceFrame>
      <main className="absolute inset-0 overflow-y-auto pt-[max(8px,env(safe-area-inset-top))] pb-[96px]">
        {children}
      </main>
      <BottomNav />
      <Toast />
    </DeviceFrame>
  );
}
