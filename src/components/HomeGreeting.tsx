"use client";

import { useOnboarding } from "@/components/OnboardingProvider";

function timeGreeting(hour: number): string {
  if (hour < 6) return "Buenas noches";
  if (hour < 13) return "Buenos días";
  if (hour < 21) return "Buenas tardes";
  return "Buenas noches";
}

/** Personalised greeting for /inicio, using the onboarding name. */
export function HomeGreeting() {
  const { data } = useOnboarding();
  const name = data?.name?.trim();
  const greeting = timeGreeting(new Date().getHours());
  return (
    <>
      {greeting}
      {name ? `, ${name}` : ""}.
    </>
  );
}
