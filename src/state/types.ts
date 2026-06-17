// ------------------------------------------------------------------
//  Core domain types for LifeOS
// ------------------------------------------------------------------

export type SpaceId = "casa" | "coche" | "mascotas" | "familia";

export type ModuleId = SpaceId | "persona";

export type Severity = "danger" | "warn" | "info";

/** Status colour used across attention cards and calendar load. */
export type Load = "tranquilo" | "ocupado" | "saturado";

export type CalendarType =
  | "evento"
  | "tarea"
  | "vencimiento"
  | "cumpleanos"
  | "mascota"
  | "coche"
  | "casa"
  | "entreno";

export interface AttentionItem {
  id: string;
  severity: Severity;
  title: string;
  module: string; // human label, e.g. "Coche"
  spaceId?: SpaceId;
  description: string;
  actionLabel: string;
}

export interface CalendarEntry {
  id: string;
  /** ISO date — YYYY-MM-DD */
  date: string;
  type: CalendarType;
  title: string;
  time?: string; // e.g. "10:00"
  module?: string;
}

export interface SpaceSection {
  title: string;
  /** Plain rows: label + optional value/meta + optional severity dot */
  rows: {
    label: string;
    value?: string;
    severity?: Severity;
    mono?: boolean;
  }[];
}

export interface VisualProject {
  id: string;
  title: string;
  spaceId: SpaceId;
  summary: string;
  budget: string;
  /** abstract palette swatches for the SVG mockup */
  palette: string[];
}

export interface SpaceData {
  id: SpaceId;
  name: string;
  status: string; // e.g. "Requiere atención"
  load: Load;
  itemCount: number;
  alertCount: number;
  nextAction: string;
  blurb: string; // short quote shown on the grid card
  /** permanent advisory banner, e.g. vet disclaimer */
  notice?: string;
  sectionTitles: string[];
  sections: SpaceSection[];
  insights: string[];
  projects: VisualProject[];
}

export interface AnalyzedDoc {
  id: string;
  name: string;
  type: string; // "Póliza de seguro de vehículo"
  module: string; // "Coche"
  date: string; // human date analysed
  summary: string;
  saved: string[]; // what was kept
  originalKept: boolean;
  reminderCreated: boolean;
  needsReview?: boolean;
}

export type Mood = "muy-bajo" | "bajo" | "normal" | "bueno" | "excelente";

export type Workout =
  | "ninguno"
  | "tren-superior"
  | "pierna"
  | "cardio"
  | "full-body"
  | "otro";

export interface PersonaDay {
  id: string;
  /** ISO date */
  date: string;
  label: string; // "Lunes", "Hoy"
  sleepHours: number;
  mood: Mood;
  energy: number; // 1-5
  stress?: number; // 1-5
  workout: Workout;
  note?: string;
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** structured assistant answer */
  answer?: AssistantAnswer;
}

export interface AssistantAnswer {
  summary: string;
  bullets: string[];
  load?: string;
  recommendation: string;
}

export interface ToastState {
  id: number;
  message: string;
  /** module whose icon animates toward the toast */
  module?: ModuleId;
}

export type Tab = "inicio" | "calendario" | "capturar" | "espacios" | "persona";
