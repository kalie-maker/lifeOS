"use client";

import { useApp } from "@/state/AppContext";
import type { CalendarEntry, CalendarType, Load } from "@/state/types";
import { Sheet } from "@/components/ui/Sheet";
import { Button, SectionLabel } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TODAY_ISO, longDay } from "@/lib/dates";

export const calendarTypeIcon: Record<CalendarType, IconName> = {
  evento: "calendar",
  tarea: "check",
  vencimiento: "clock",
  cumpleanos: "gift",
  mascota: "paw",
  coche: "car",
  casa: "house",
  entreno: "dumbbell",
};

export function loadFromCount(n: number): Load {
  if (n >= 4) return "saturado";
  if (n >= 2) return "ocupado";
  return "tranquilo";
}

const loadLabel: Record<Load, string> = {
  tranquilo: "Tranquilo",
  ocupado: "Ocupado",
  saturado: "Saturado",
};

const loadRecommendation: Record<Load, string> = {
  tranquilo:
    "Un día tranquilo. Buen momento para algo que tenga pendiente.",
  ocupado:
    "Tiene cierta actividad. Deje margen entre compromisos.",
  saturado: "Este día ya está cargado. Evite añadir tareas nuevas.",
};

function EntryRow({ entry }: { entry: CalendarEntry }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg text-ink-2">
        <Icon name={calendarTypeIcon[entry.type]} size={16} />
      </span>
      <span className="flex-1 text-base text-ink">{entry.title}</span>
      {entry.time && (
        <span className="font-mono text-sm text-ink-2">{entry.time}</span>
      )}
    </div>
  );
}

export function DaySheet({
  iso,
  onClose,
}: {
  iso: string | null;
  onClose: () => void;
}) {
  const { calendar, setTab, openAssistant } = useApp();
  if (!iso) return null;

  const items = calendar
    .filter((e) => e.date === iso)
    .sort((a, b) => (a.time ?? "99").localeCompare(b.time ?? "99"));
  const load = loadFromCount(items.length);

  const eventos = items.filter((e) =>
    ["evento", "mascota", "coche", "casa", "entreno", "cumpleanos"].includes(
      e.type,
    ),
  );
  const tareas = items.filter((e) => e.type === "tarea");
  const venc = items.filter((e) => e.type === "vencimiento");

  return (
    <Sheet open={!!iso} onClose={onClose} side="bottom" height="auto">
      <div className="px-5 pb-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl text-ink">{longDay(iso)}</h2>
          <span className="text-sm text-ink-2">· {loadLabel[load]}</span>
        </div>

        {items.length === 0 && (
          <p className="mt-4 text-sm text-ink-2">
            No tiene nada anotado este día. Un buen hueco si lo necesita.
          </p>
        )}

        {eventos.length > 0 && (
          <section className="mt-5">
            <SectionLabel>Eventos ({eventos.length})</SectionLabel>
            <div className="mt-1 divide-y divide-border">
              {eventos.map((e) => (
                <EntryRow key={e.id} entry={e} />
              ))}
            </div>
          </section>
        )}

        {tareas.length > 0 && (
          <section className="mt-5">
            <SectionLabel>Tareas ({tareas.length})</SectionLabel>
            <div className="mt-1 divide-y divide-border">
              {tareas.map((e) => (
                <EntryRow key={e.id} entry={e} />
              ))}
            </div>
          </section>
        )}

        {venc.length > 0 && (
          <section className="mt-5">
            <SectionLabel>Vencimientos ({venc.length})</SectionLabel>
            <div className="mt-1 divide-y divide-border">
              {venc.map((e) => (
                <EntryRow key={e.id} entry={e} />
              ))}
            </div>
          </section>
        )}

        {/* LifeOS recommendation */}
        <div className="mt-6 rounded-xl border border-border bg-bg p-4">
          <div className="flex items-center gap-2 text-accent">
            <Icon name="sparkle" size={16} />
            <span className="text-xs font-medium uppercase tracking-[0.12em]">
              LifeOS recomienda
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {loadRecommendation[load]}
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            variant="secondary"
            block
            icon="plus"
            onClick={() => {
              onClose();
              setTab("capturar");
            }}
          >
            Añadir
          </Button>
          <Button
            variant="primary"
            block
            icon="chat"
            onClick={() => {
              onClose();
              openAssistant(
                iso === TODAY_ISO ? "¿Qué tengo hoy?" : "¿Qué días tengo más carga?",
              );
            }}
          >
            Preguntar
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
