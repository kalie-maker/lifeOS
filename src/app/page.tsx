import { AppProvider } from "@/state/AppContext";
import { AppShell } from "@/components/AppShell";

export default function Page() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
