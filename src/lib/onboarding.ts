// ------------------------------------------------------------------
//  Onboarding persistence. localStorage for now; Supabase in Fase 3.
// ------------------------------------------------------------------

export type LivingStatus = "solo" | "pareja" | "familia";

/** Asset keys captured in step 3 (coche, moto, mascotas). */
export type AssetKey = "coche" | "moto" | "perro" | "gato" | "otra";

export interface OnboardingData {
  name: string;
  livingStatus: LivingStatus;
  familyCount?: number;
  assets: AssetKey[];
  freeCapture: string;
  onboardingCompleted: true;
}

const STORAGE_KEY = "lifeos.onboarding.v1";

export function readOnboarding(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingData;
    return parsed?.onboardingCompleted ? parsed : null;
  } catch {
    return null;
  }
}

export function saveOnboarding(data: OnboardingData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* almacenamiento no disponible — se ignora en el prototipo */
  }
}

export function clearOnboarding(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

// ── Etiquetas legibles (tono formal) ────────────────────────────────
export const livingLabels: Record<LivingStatus, string> = {
  solo: "Solo",
  pareja: "En pareja",
  familia: "Con familia",
};

export const assetLabels: Record<AssetKey, string> = {
  coche: "Coche",
  moto: "Moto",
  perro: "Perro",
  gato: "Gato",
  otra: "Otra mascota",
};
