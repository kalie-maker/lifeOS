import type {
  AssistantAnswer,
  AttentionItem,
  CalendarEntry,
  PersonaDay,
} from "@/state/types";
import { TODAY, TODAY_ISO, addDays, fromISO, longDay, toISO } from "./dates";
import { moodLabels, moodScore, workoutLabels } from "@/data/mock/persona";

export const assistantSuggestions = [
  "¿Qué tengo hoy?",
  "¿Qué se me puede olvidar esta semana?",
  "¿Qué puede costarme dinero si lo dejo pasar?",
  "¿Qué tengo pendiente del coche?",
  "¿Qué documentos vencen pronto?",
  "¿Qué días tengo más carga?",
  "¿Cómo fue mi semana de entrenos?",
  "¿Qué puedo posponer?",
];

export interface AssistantContext {
  calendar: CalendarEntry[];
  attention: AttentionItem[];
  persona: PersonaDay[];
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function loadFor(count: number): string {
  if (count >= 4) return "saturado";
  if (count >= 2) return "ocupado";
  if (count === 1) return "tranquilo";
  return "libre";
}

function countByDate(calendar: CalendarEntry[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of calendar) m.set(e.date, (m.get(e.date) ?? 0) + 1);
  return m;
}

// ── Intent handlers ──────────────────────────────────────────────────
function answerToday(ctx: AssistantContext): AssistantAnswer {
  const today = ctx.calendar.filter((e) => e.date === TODAY_ISO);
  const eventos = today.filter((e) => e.type === "evento");
  const venc = today.filter((e) => e.type === "vencimiento");
  return {
    summary: `Hoy tiene ${eventos.length} ${
      eventos.length === 1 ? "evento" : "eventos"
    } y ${venc.length} ${venc.length === 1 ? "vencimiento" : "vencimientos"}.`,
    bullets: today.map((e) =>
      e.time ? `${e.time} · ${e.title}` : e.title,
    ),
    recommendation:
      "Tiene una tarde manejable. Resuelva el pago de la tarjeta antes del cierre del día.",
  };
}

function answerWeek(ctx: AssistantContext): AssistantAnswer {
  const end = addDays(TODAY, 7);
  const week = ctx.calendar
    .filter((e) => {
      const d = fromISO(e.date);
      return d >= TODAY && d <= end;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  const easilyForgotten = week.filter(
    (e) => e.type === "vencimiento" || e.type === "tarea",
  );
  return {
    summary: `Esta semana tiene ${week.length} elementos. Estos son los más fáciles de olvidar:`,
    bullets: easilyForgotten.map(
      (e) => `${longDay(e.date)} · ${e.title}`,
    ),
    recommendation:
      "El pago del alquiler del viernes es el más sensible. Déjelo programado hoy mismo.",
  };
}

function answerMoney(ctx: AssistantContext): AssistantAnswer {
  return {
    summary: "Tres cosas pueden costarle dinero si las deja pasar:",
    bullets: [
      "ITV vencida: arriesga sanción y no poder circular. Resérvela este mes.",
      "Seguro del coche (Mapfre, 692 €): se renueva solo en octubre. Compare 30 días antes.",
      "Factura de luz un 18% más alta: revisar potencia y franjas puede ahorrarle cada mes.",
    ],
    recommendation:
      "La ITV es lo más urgente: su coste de no hacerla es el más alto y el plazo, el más corto.",
  };
}

function answerCar(ctx: AssistantContext): AssistantAnswer {
  const carItems = ctx.calendar.filter(
    (e) => (e.module ?? "").toLowerCase() === "coche",
  );
  return {
    summary: "Tiene tres cosas pendientes con el coche:",
    bullets: [
      "ITV: sin cita y vence este mes.",
      "Seguro Mapfre: 692 € · se renueva en octubre.",
      "Revisión en taller programada para el 26 de junio.",
      ...carItems
        .filter((e) => e.type === "evento")
        .map((e) => `${e.title}.`),
    ],
    recommendation:
      "Antes de la ITV, revise neumáticos, luces y limpiaparabrisas para no tener que repetirla.",
  };
}

function answerDocuments(ctx: AssistantContext): AssistantAnswer {
  const venc = ctx.calendar
    .filter((e) => e.type === "vencimiento")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  return {
    summary: "Estos vencimientos son los más próximos:",
    bullets: venc.map((e) => `${longDay(e.date)} · ${e.title}`),
    recommendation:
      "El seguro del coche y el del hogar tienen renovación automática. Decida con tiempo si desea continuar.",
  };
}

function answerLoad(ctx: AssistantContext): AssistantAnswer {
  const counts = countByDate(ctx.calendar);
  const upcoming = [...counts.entries()]
    .filter(([iso]) => fromISO(iso) >= TODAY)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  return {
    summary: "Sus días con más carga próximamente:",
    bullets: upcoming.map(
      ([iso, n]) => `${longDay(iso)} · ${n} elementos · ${loadFor(n)}`,
    ),
    load: "El lunes 22 es su día más saturado del mes.",
    recommendation:
      "Evite añadir tareas nuevas el lunes 22. Si algo puede esperar, muévalo al jueves.",
  };
}

function answerWorkouts(ctx: AssistantContext): AssistantAnswer {
  const trained = ctx.persona.filter((d) => d.workout !== "ninguno");
  const avgSleep =
    ctx.persona.reduce((s, d) => s + d.sleepHours, 0) / ctx.persona.length;
  const worst = [...ctx.persona].sort(
    (a, b) => a.energy - b.energy,
  )[0];
  return {
    summary: `Entrenó ${trained.length} de los últimos ${ctx.persona.length} días.`,
    bullets: [
      ...trained.map(
        (d) => `${d.label}: ${workoutLabels[d.workout]} · ánimo ${moodLabels[d.mood].toLowerCase()}`,
      ),
      `Sueño medio: ${avgSleep.toFixed(1)} h por noche.`,
    ],
    load: `Su día más flojo fue el ${worst.label.toLowerCase()}: ${worst.sleepHours} h de sueño y sin entrenar.`,
    recommendation:
      "Su ánimo fue mejor los días que entrenó. Mantener tres sesiones por semana le sienta bien.",
  };
}

function answerPostpone(ctx: AssistantContext): AssistantAnswer {
  return {
    summary: "Esto puede esperar sin consecuencias inmediatas:",
    bullets: [
      "Comprar el regalo de Marta: el cumpleaños es el 24, tiene margen.",
      "Buscar inspiración para el salón: es un proyecto, no una urgencia.",
      "Comparar el seguro del coche: puede esperar a septiembre, 30 días antes.",
    ],
    recommendation:
      "No posponga la ITV ni la autorización escolar: ambas tienen plazo y consecuencias.",
  };
}

// ── Router ───────────────────────────────────────────────────────────
export function answerQuestion(
  question: string,
  ctx: AssistantContext,
): AssistantAnswer {
  const q = norm(question);

  if (q.includes("hoy")) return answerToday(ctx);
  if (q.includes("coche") || q.includes("itv")) return answerCar(ctx);
  if (q.includes("entren")) return answerWorkouts(ctx);
  if (q.includes("pospon") || q.includes("aplaz") || q.includes("esperar"))
    return answerPostpone(ctx);
  if (q.includes("dinero") || q.includes("cost") || q.includes("pagar"))
    return answerMoney(ctx);
  if (q.includes("document") || q.includes("venc") || q.includes("caduc"))
    return answerDocuments(ctx);
  if (q.includes("carga") || q.includes("dia") || q.includes("ocupad") || q.includes("saturad"))
    return answerLoad(ctx);
  if (q.includes("olvid") || q.includes("semana")) return answerWeek(ctx);

  // Sensible default — orient the user toward what matters now.
  return {
    summary: "Esto es lo más relevante ahora mismo:",
    bullets: [
      "ITV del coche: pendiente y vence este mes.",
      "Seguro del hogar: se renueva en seis semanas.",
      "Tiene 2 eventos y 1 vencimiento hoy.",
    ],
    recommendation:
      "Puede preguntarme por su día, su semana, el coche, los documentos o sus entrenos.",
  };
}
