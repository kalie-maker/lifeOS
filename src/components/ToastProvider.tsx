"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface ToastState {
  id: number;
  message: string;
}

interface ToastContextValue {
  toast: ToastState | null;
  showToast: (message: string) => void;
}

const Ctx = createContext<ToastContextValue | null>(null);

let seq = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    if (timer.current) window.clearTimeout(timer.current);
    setToast({ id: seq++, message });
    timer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <Ctx.Provider value={{ toast, showToast }}>{children}</Ctx.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
