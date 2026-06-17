import type { PersonaDay } from "@/state/types";

// Last five logged days. Today (2026-06-17) is intentionally unlogged
// so the "Registrar cómo estoy hoy" flow has something to add.
export const mockPersona: PersonaDay[] = [
  { id: "p-12", date: "2026-06-12", label: "Viernes", sleepHours: 7, mood: "bueno", energy: 4, stress: 2, workout: "pierna" },
  { id: "p-13", date: "2026-06-13", label: "Sábado", sleepHours: 6, mood: "normal", energy: 3, stress: 3, workout: "ninguno" },
  { id: "p-14", date: "2026-06-14", label: "Domingo", sleepHours: 5, mood: "bajo", energy: 2, stress: 4, workout: "ninguno", note: "Día flojo, dormí poco." },
  { id: "p-15", date: "2026-06-15", label: "Lunes", sleepHours: 7.5, mood: "bueno", energy: 4, stress: 2, workout: "cardio" },
  { id: "p-16", date: "2026-06-16", label: "Martes", sleepHours: 8, mood: "excelente", energy: 5, stress: 1, workout: "tren-superior" },
];

export const moodLabels: Record<PersonaDay["mood"], string> = {
  "muy-bajo": "Muy bajo",
  bajo: "Bajo",
  normal: "Normal",
  bueno: "Bueno",
  excelente: "Excelente",
};

export const moodScore: Record<PersonaDay["mood"], number> = {
  "muy-bajo": 1,
  bajo: 2,
  normal: 3,
  bueno: 4,
  excelente: 5,
};

export const workoutLabels: Record<PersonaDay["workout"], string> = {
  ninguno: "No entrenó",
  "tren-superior": "Tren superior",
  pierna: "Pierna",
  cardio: "Cardio",
  "full-body": "Full body",
  otro: "Otro",
};
