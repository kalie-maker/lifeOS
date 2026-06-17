import type { ReactNode } from "react";

/**
 * The shared mobile-first device frame: a centred ~430px column that becomes
 * a device on desktop. Used by the app shell and the onboarding flow.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#ECEAE5] sm:p-6">
      <div className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-bg sm:h-[880px] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[44px] sm:border sm:border-[#dcd8d1] sm:shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        {children}
      </div>
    </div>
  );
}
