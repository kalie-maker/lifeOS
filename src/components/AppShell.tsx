"use client";

import { useApp } from "@/state/AppContext";
import { BottomNav } from "./BottomNav";
import { Onboarding } from "./Onboarding";
import { HomeScreen } from "./screens/HomeScreen";
import { CalendarScreen } from "./screens/CalendarScreen";
import { CaptureScreen } from "./screens/CaptureScreen";
import { SpacesScreen } from "./screens/SpacesScreen";
import { PersonaScreen } from "./screens/PersonaScreen";
import { SpaceDetailScreen } from "./screens/SpaceDetailScreen";
import { AssistantSheet } from "./modals/AssistantSheet";
import { ProfileSheet } from "./modals/ProfileSheet";
import { Toast } from "./ui/Toast";

export function AppShell() {
  const { onboarded, tab, spaceDetail, spaces } = useApp();

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#ECEAE5] sm:p-6">
      <div className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-bg sm:h-[880px] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[44px] sm:border sm:border-[#dcd8d1] sm:shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        {!onboarded ? (
          <div className="absolute inset-0">
            <Onboarding />
          </div>
        ) : (
          <>
            <main
              key={tab}
              className="los-fade-in absolute inset-0 overflow-y-auto pt-[max(8px,env(safe-area-inset-top))] pb-[96px]"
            >
              {tab === "inicio" && <HomeScreen />}
              {tab === "calendario" && <CalendarScreen />}
              {tab === "capturar" && <CaptureScreen />}
              {tab === "espacios" && <SpacesScreen />}
              {tab === "persona" && <PersonaScreen />}
            </main>

            <BottomNav />

            {spaceDetail && (
              <SpaceDetailScreen space={spaces[spaceDetail]} />
            )}

            <AssistantSheet />
            <ProfileSheet />
            <Toast />
          </>
        )}
      </div>
    </div>
  );
}
