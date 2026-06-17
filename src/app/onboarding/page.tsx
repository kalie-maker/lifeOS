"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/OnboardingProvider";
import { DeviceFrame } from "@/components/DeviceFrame";
import { Splash } from "@/components/Splash";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  const { status } = useOnboarding();
  const router = useRouter();

  // Already onboarded → straight to the app.
  useEffect(() => {
    if (status === "done") router.replace("/inicio");
  }, [status, router]);

  if (status !== "new") {
    return (
      <DeviceFrame>
        <Splash />
      </DeviceFrame>
    );
  }

  return (
    <DeviceFrame>
      <OnboardingFlow />
    </DeviceFrame>
  );
}
