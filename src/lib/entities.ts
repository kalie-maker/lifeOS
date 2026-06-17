import type { IconName } from "@/components/ui/Icon";

// ------------------------------------------------------------------
//  Captured entities. Produced by Claude (/api/capture), confirmed by
//  the user, persisted to localStorage. Supabase will replace storage
//  in a later phase — the shapes here are designed to map cleanly.
// ------------------------------------------------------------------

export type EntityType = "reminder" | "event" | "asset" | "note";
export type SpaceKey = "car" | "home" | "pet" | "family" | "person" | "general";

/** Raw entity as returned by Claude. */
export interface CaptureEntity {
  type: EntityType;
  space: SpaceKey;
  title: string;
  description: string;
  date: string | null;
  expiry_date: string | null;
  tags: string[];
}

/** Full result of one capture call. */
export interface CaptureResult {
  entities: CaptureEntity[];
  summary: string;
  pending_questions: string[];
}

/** Entity once confirmed and stored. */
export interface StoredEntity extends CaptureEntity {
  id: string;
  created_at: string;
  confirmed: boolean;
  source: "text_capture";
}

const STORAGE_KEY = "lifeos_entities";

export function readEntities(): StoredEntity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredEntity[]) : [];
  } catch {
    return [];
  }
}

export function writeEntities(entities: StoredEntity[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
  } catch {
    /* storage unavailable — ignored in the prototype */
  }
}

/** Turn confirmed capture entities into stored entities (newest first). */
export function toStored(entities: CaptureEntity[]): StoredEntity[] {
  const now = new Date().toISOString();
  return entities.map((e) => ({
    ...e,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `ent-${Math.random().toString(36).slice(2)}-${Date.now()}`,
    created_at: now,
    confirmed: true,
    source: "text_capture",
  }));
}

// ── Labels & icons (formal Spanish, premium iconography) ─────────────
export const entityTypeLabel: Record<EntityType, string> = {
  reminder: "Recordatorio",
  event: "Evento",
  asset: "Dato",
  note: "Nota",
};

export const entityTypeIcon: Record<EntityType, IconName> = {
  reminder: "bell",
  event: "calendar",
  asset: "box",
  note: "document",
};

export const spaceLabel: Record<SpaceKey, string> = {
  car: "Coche",
  home: "Casa",
  pet: "Mascotas",
  family: "Familia",
  person: "Persona",
  general: "General",
};

export const spaceIcon: Record<SpaceKey, IconName> = {
  car: "car",
  home: "house",
  pet: "paw",
  family: "family",
  person: "heart",
  general: "sparkle",
};

export const entityTypes: EntityType[] = ["reminder", "event", "asset", "note"];

/** "1 oct 2026" from an ISO date, or null if unparseable. */
export function formatEntityDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** The relevant date for sorting / "attention" logic. */
export function entityDate(e: CaptureEntity): string | null {
  return e.date ?? e.expiry_date ?? null;
}

/** Reminder, or anything with a date within the next ~30 days. */
export function needsAttention(e: StoredEntity): boolean {
  if (e.type === "reminder") return true;
  const iso = entityDate(e);
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const days = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= -1 && days <= 30;
}
