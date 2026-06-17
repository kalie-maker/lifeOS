"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/state/AppContext";
import type { Load } from "@/state/types";
import {
  TODAY,
  TODAY_ISO,
  monthGrid,
  monthTitle,
  weekOf,
} from "@/lib/dates";
import { SectionLabel } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { DaySheet, loadFromCount } from "@/components/modals/DaySheet";

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

const loadTint: Record<Load, string> = {
  tranquilo: "",
  ocupado: "bg-[color-mix(in_srgb,var(--color-warn)_9%,transparent)]",
  saturado: "bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)]",
};

const loadDot: Record<Load, string> = {
  tranquilo: "var(--color-ink-3)",
  ocupado: "var(--color-warn)",
  saturado: "var(--color-danger)",
};

export function CalendarScreen() {
  const { calendar } = useApp();
  const [view, setView] = useState<"mes" | "semana">("mes");
  const [cursor, setCursor] = useState({
    year: TODAY.getFullYear(),
    month: TODAY.getMonth(),
  });
  const [selected, setSelected] = useState<string | null>(null);

  const countByDate = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of calendar) m.set(e.date, (m.get(e.date) ?? 0) + 1);
    return m;
  }, [calendar]);

  const grid = useMemo(
    () => monthGrid(cursor.year, cursor.month),
    [cursor],
  );
  const week = useMemo(() => weekOf(TODAY_ISO), []);

  const cells = view === "mes" ? grid : null;

  function shiftMonth(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <div className="px-5 pb-6 pt-3">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Calendario</h1>
        {/* view toggle */}
        <div className="flex rounded-full border border-border bg-surface p-0.5 text-sm">
          {(["mes", "semana"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1 capitalize transition-colors ${
                view === v ? "bg-accent text-white" : "text-ink-2"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "mes" && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => shiftMonth(-1)}
            aria-label="Mes anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface"
          >
            <Icon name="chevron-right" size={18} className="rotate-180" />
          </button>
          <span className="font-display text-md text-ink">
            {monthTitle(cursor.year, cursor.month)}
          </span>
          <button
            onClick={() => shiftMonth(1)}
            aria-label="Mes siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface"
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      )}

      {/* Weekday header */}
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center font-mono text-xs text-ink-3"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Month grid */}
      {cells && (
        <div className="mt-1.5 grid grid-cols-7 gap-1.5">
          {cells.map((cell) => {
            const count = countByDate.get(cell.iso) ?? 0;
            const load = count > 0 ? loadFromCount(count) : "tranquilo";
            const dots = Math.min(count, 3);
            return (
              <button
                key={cell.iso}
                onClick={() => count >= 0 && setSelected(cell.iso)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors ${
                  cell.inMonth ? "text-ink" : "text-ink-3/50"
                } ${count > 0 ? loadTint[load] : "hover:bg-surface"} ${
                  cell.isToday ? "ring-[1.5px] ring-accent" : ""
                }`}
              >
                <span
                  className={`font-mono ${cell.isToday ? "font-semibold text-accent" : ""}`}
                >
                  {cell.date.getDate()}
                </span>
                {dots > 0 && (
                  <span className="mt-1 flex gap-0.5">
                    {Array.from({ length: dots }).map((_, i) => (
                      <span
                        key={i}
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: loadDot[load] }}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Week view */}
      {view === "semana" && (
        <>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {week.map((cell) => {
              const count = countByDate.get(cell.iso) ?? 0;
              const load = count > 0 ? loadFromCount(count) : "tranquilo";
              return (
                <button
                  key={cell.iso}
                  onClick={() => setSelected(cell.iso)}
                  className={`flex flex-col items-center gap-1 rounded-xl py-3 transition-colors ${
                    count > 0 ? loadTint[load] : "hover:bg-surface"
                  } ${cell.isToday ? "ring-[1.5px] ring-accent" : ""}`}
                >
                  <span className="font-mono text-lg text-ink">
                    {cell.date.getDate()}
                  </span>
                  {count > 0 && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: loadDot[load] }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <section className="mt-6">
            <SectionLabel>Esta semana</SectionLabel>
            <div className="mt-3 space-y-2">
              {week
                .filter((c) => (countByDate.get(c.iso) ?? 0) > 0)
                .map((c) => {
                  const items = calendar.filter((e) => e.date === c.iso);
                  return (
                    <button
                      key={c.iso}
                      onClick={() => setSelected(c.iso)}
                      className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-ink-3"
                    >
                      <div className="w-10 shrink-0 text-center">
                        <div className="font-mono text-md text-ink">
                          {c.date.getDate()}
                        </div>
                        <div className="font-mono text-xs text-ink-3">
                          {WEEKDAY_LABELS[(c.date.getDay() + 6) % 7]}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink">
                          {items[0].title}
                        </p>
                        {items.length > 1 && (
                          <p className="text-xs text-ink-3">
                            y {items.length - 1} más
                          </p>
                        )}
                      </div>
                      <Icon
                        name="chevron-right"
                        size={16}
                        className="text-ink-3"
                      />
                    </button>
                  );
                })}
            </div>
          </section>
        </>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-5 text-xs text-ink-3">
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: loadDot.ocupado }}
          />
          Ocupado
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: loadDot.saturado }}
          />
          Saturado
        </span>
      </div>

      <DaySheet iso={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
