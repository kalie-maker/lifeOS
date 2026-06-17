"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  readOnboarding,
  saveOnboarding,
  clearOnboarding,
  type OnboardingData,
} from "@/lib/onboarding";

type Status = "loading" | "new" | "done";

interface OnboardingContextValue {
  status: Status;
  data: OnboardingData | null;
  /** Persist completed onboarding and update context. */
  complete: (data: OnboardingData) => void;
  /** Re-read from storage (e.g. after clearing). */
  refresh: () => void;
  reset: () => void;
}

const Ctx = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  // Always start "loading" so SSR and first client paint match.
  const [state, setState] = useState<{ status: Status; data: OnboardingData | null }>(
    { status: "loading", data: null },
  );

  const refresh = useCallback(() => {
    const data = readOnboarding();
    setState(data ? { status: "done", data } : { status: "new", data: null });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const complete = useCallback((data: OnboardingData) => {
    saveOnboarding(data);
    setState({ status: "done", data });
  }, []);

  const reset = useCallback(() => {
    clearOnboarding();
    setState({ status: "new", data: null });
  }, []);

  return (
    <Ctx.Provider value={{ ...state, complete, refresh, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
