import type { CalendarEntry } from "@/state/types";

// Anchored to TODAY = 2026-06-17 (Wednesday).
export const mockCalendar: CalendarEntry[] = [
  // ── Recent training (feeds Persona) ──
  { id: "cal-ent-12", date: "2026-06-12", type: "entreno", title: "Entreno: pierna", module: "Persona" },
  { id: "cal-ent-15", date: "2026-06-15", type: "entreno", title: "Entreno: cardio", module: "Persona" },
  { id: "cal-ent-16", date: "2026-06-16", type: "entreno", title: "Entreno: tren superior", module: "Persona" },

  // ── Today (2 eventos · 1 vencimiento) ──
  { id: "cal-17-a", date: "2026-06-17", type: "evento", title: "Llamada con la gestoría", time: "09:30" },
  { id: "cal-17-b", date: "2026-06-17", type: "evento", title: "Recoger ropa de la tintorería", time: "18:00" },
  { id: "cal-17-c", date: "2026-06-17", type: "vencimiento", title: "Pago de la tarjeta", module: "Casa" },

  // ── Friday 19 (the "Ocupado" demo day) ──
  { id: "cal-19-a", date: "2026-06-19", type: "mascota", title: "Revisión veterinaria", time: "10:00", module: "Mascotas" },
  { id: "cal-19-b", date: "2026-06-19", type: "evento", title: "Reunión de trabajo", time: "15:00" },
  { id: "cal-19-c", date: "2026-06-19", type: "vencimiento", title: "Pago del alquiler", module: "Casa" },

  // ── Monday 22 (a "Saturado" day) ──
  { id: "cal-22-a", date: "2026-06-22", type: "evento", title: "Inicio de la formación", time: "09:00" },
  { id: "cal-22-b", date: "2026-06-22", type: "evento", title: "Comida con cliente", time: "14:00" },
  { id: "cal-22-c", date: "2026-06-22", type: "tarea", title: "Entregar el informe trimestral" },
  { id: "cal-22-d", date: "2026-06-22", type: "vencimiento", title: "Renovar abono de transporte" },

  // ── Rest of the month ──
  { id: "cal-24", date: "2026-06-24", type: "cumpleanos", title: "Cumpleaños de Marta", module: "Familia" },
  { id: "cal-26", date: "2026-06-26", type: "coche", title: "Llevar el coche a revisión", module: "Coche" },
  { id: "cal-itv", date: "2026-06-30", type: "vencimiento", title: "ITV — fecha límite estimada", module: "Coche" },

  // ── Future vencimientos ──
  { id: "cal-hogar", date: "2026-08-01", type: "vencimiento", title: "Renovación del seguro del hogar", module: "Casa" },
  { id: "cal-coche-seg", date: "2026-10-01", type: "vencimiento", title: "Renovación del seguro del coche (Mapfre)", module: "Coche" },
];
