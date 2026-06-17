"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import { screenVariants } from "@/lib/motion";
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

const screens = {
  inicio: HomeScreen,
  calendario: CalendarScreen,
  capturar: CaptureScreen,
  espacios: SpacesScreen,
  persona: PersonaScreen,
} as const;

export function AppShell() {
  const { onboarded, tab, spaceDetail, spaces } = useApp();
  const Screen = screens[tab];

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#ECEAE5] sm:p-6">
        <div className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-bg sm:h-[880px] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[44px] sm:border sm:border-[#dcd8d1] sm:shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
          <AnimatePresence mode="wait" initial={false}>
            {!onboarded ? (
              <motion.div
                key="onboarding"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <Onboarding />
              </motion.div>
            ) : (
              <motion.div
                key="app"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                {/* Screen transitions */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.main
                    key={tab}
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 overflow-y-auto pt-[max(8px,env(safe-area-inset-top))] pb-[96px]"
                  >
                    <Screen />
                  </motion.main>
                </AnimatePresence>

                <BottomNav />

                {/* Space detail overlay */}
                <AnimatePresence>
                  {spaceDetail && (
                    <SpaceDetailScreen
                      key="space-detail"
                      space={spaces[spaceDetail]}
                    />
                  )}
                </AnimatePresence>

                <AssistantSheet />
                <ProfileSheet />
                <Toast />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
