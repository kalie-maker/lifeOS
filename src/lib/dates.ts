// ------------------------------------------------------------------
//  Date helpers. "Today" is anchored so the mock stays coherent.
// ------------------------------------------------------------------

/** Anchored present for the prototype: Wednesday, 17 June 2026. */
export const TODAY = new Date(2026, 5, 17);

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
// JS getDay(): 0 = Sunday … 6 = Saturday
const WEEKDAYS = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const TODAY_ISO = toISO(TODAY);

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** "miércoles, 17 jun" — for the home greeting header. */
export function greetingDate(d: Date = TODAY): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** "Viernes 19 junio" — for the day sheet header. */
export function longDay(iso: string): string {
  const d = fromISO(iso);
  return `${cap(WEEKDAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "1 oct 2026" — compact for reminders. */
export function shortDate(iso: string): string {
  const d = fromISO(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** Spanish month + year, e.g. "junio 2026". */
export function monthTitle(year: number, month: number): string {
  return `${cap(MONTHS[month])} ${year}`;
}

export function shortWeekday(d: Date): string {
  return ["L", "M", "X", "J", "V", "S", "D"][(d.getDay() + 6) % 7];
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Human distance from today, e.g. "en 6 semanas", "este mes". */
export function relativeFromToday(iso: string): string {
  const target = fromISO(iso);
  const days = Math.round(
    (target.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days < 0) return "vencido";
  if (days === 0) return "hoy";
  if (days === 1) return "mañana";
  if (days <= 7) return `en ${days} días`;
  if (
    target.getMonth() === TODAY.getMonth() &&
    target.getFullYear() === TODAY.getFullYear()
  )
    return "este mes";
  const weeks = Math.round(days / 7);
  if (weeks <= 10) return `en ${weeks} semanas`;
  const months = Math.round(days / 30);
  return `en ${months} meses`;
}

/**
 * Build a 6×7 grid (Monday-first) for a given month, marking which
 * days belong to the displayed month.
 */
export function monthGrid(
  year: number,
  month: number,
): { date: Date; iso: string; inMonth: boolean; isToday: boolean }[] {
  const first = new Date(year, month, 1);
  // Monday-first offset
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = addDays(first, -startOffset);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    cells.push({
      date,
      iso: toISO(date),
      inMonth: date.getMonth() === month,
      isToday: toISO(date) === TODAY_ISO,
    });
  }
  return cells;
}

/** Monday-first week containing `iso`. */
export function weekOf(iso: string): { date: Date; iso: string; isToday: boolean }[] {
  const d = fromISO(iso);
  const offset = (d.getDay() + 6) % 7;
  const monday = addDays(d, -offset);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    return { date, iso: toISO(date), isToday: toISO(date) === TODAY_ISO };
  });
}

/** Greeting that respects the time of day (anchored ~afternoon). */
export function timeGreeting(hour = 16): string {
  if (hour < 6) return "Buenas noches";
  if (hour < 13) return "Buenos días";
  if (hour < 21) return "Buenas tardes";
  return "Buenas noches";
}
