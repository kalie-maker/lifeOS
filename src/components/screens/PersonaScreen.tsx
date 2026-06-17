"use client";

import { useState } from "react";
import { useApp } from "@/state/AppContext";
import type { Mood, PersonaDay } from "@/state/types";
import { Button, SectionLabel } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { moodLabels, moodScore, workoutLabels } from "@/data/mock/persona";
import { PersonaCheckInModal } from "@/components/modals/PersonaCheckInModal";

const moodColor: Record<Mood, string> = {
  "muy-bajo": "var(--color-danger)",
  bajo: "var(--color-warn)",
  normal: "var(--color-ink-3)",
  bueno: "var(--color-accent)",
  excelente: "var(--color-ok)",
};

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3.5 py-3">
      <p className="text-[11px] uppercase tracking-[0.08em] text-ink-3">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg text-ink">
        {value}
        {unit && <span className="ml-0.5 text-sm text-ink-3">{unit}</span>}
      </p>
    </div>
  );
}

function DayRow({ day }: { day: PersonaDay }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: moodColor[day.mood] }}
      />
      <span className="w-16 shrink-0 text-sm text-ink">{day.label}</span>
      <span className="w-12 shrink-0 font-mono text-sm text-ink-2">
        {day.sleepHours} h
      </span>
      <span className="flex-1 truncate text-sm text-ink-2">
        {day.workout === "ninguno" ? "Sin entreno" : workoutLabels[day.workout]}
      </span>
      {/* energy bar */}
      <span className="flex shrink-0 gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className="h-3 w-1 rounded-full"
            style={{
              backgroundColor:
                n <= day.energy ? "var(--color-accent)" : "var(--color-border)",
            }}
          />
        ))}
      </span>
    </div>
  );
}

export function PersonaScreen() {
  const { persona } = useApp();
  const [checkIn, setCheckIn] = useState(false);

  const ordered = [...persona].sort((a, b) => b.date.localeCompare(a.date));
  const trained = persona.filter((d) => d.workout !== "ninguno");
  const avgSleep = persona.length
    ? persona.reduce((s, d) => s + d.sleepHours, 0) / persona.length
    : 0;
  const avgMood = persona.length
    ? persona.reduce((s, d) => s + moodScore[d.mood], 0) / persona.length
    : 0;
  const avgStress = persona.length
    ? persona.reduce((s, d) => s + (d.stress ?? 3), 0) / persona.length
    : 0;
  const worst = persona.length
    ? [...persona].sort((a, b) => a.energy - b.energy)[0]
    : null;
  const avgMoodLabel = (
    ["", "muy-bajo", "bajo", "normal", "bueno", "excelente"] as const
  )[Math.round(avgMood)] as Mood | "";

  return (
    <div className="px-5 pb-6 pt-3">
      <h1 className="font-display text-2xl text-ink">Persona</h1>
      <p className="mt-1.5 text-base text-ink-2">
        Quién es usted esta semana y cómo se encuentra.
      </p>

      <div className="mt-5">
        <Button block icon="heart" onClick={() => setCheckIn(true)}>
          Registrar cómo estoy hoy
        </Button>
      </div>

      {persona.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-base text-ink">Aún no hay registros.</p>
          <p className="mx-auto mt-1.5 max-w-[16rem] text-sm text-ink-2">
            Registre cómo se encuentra y LifeOS empezará a mostrarle patrones
            entre su descanso, su ánimo y su actividad.
          </p>
        </div>
      ) : (
        <>
          {/* Resumen semanal */}
          <section className="mt-7">
            <SectionLabel>Resumen semanal</SectionLabel>
            <div className="mt-2 rounded-2xl border border-border bg-surface p-5">
              <p className="text-base leading-relaxed text-ink">
                Entrenó{" "}
                <span className="font-medium">{trained.length} días</span> y
                durmió de media{" "}
                <span className="font-mono">{avgSleep.toFixed(1)} h</span> por
                noche. Su ánimo se mantuvo en torno a{" "}
                <span className="font-medium">
                  {avgMoodLabel ? moodLabels[avgMoodLabel].toLowerCase() : "—"}
                </span>
                .
              </p>
            </div>
          </section>

          {/* Métricas */}
          <section className="mt-6">
            <SectionLabel>Métricas</SectionLabel>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Stat label="Sueño medio" value={avgSleep.toFixed(1)} unit="h" />
              <Stat
                label="Entrenos"
                value={`${trained.length}`}
                unit={`/ ${persona.length}`}
              />
              <Stat
                label="Ánimo medio"
                value={avgMood.toFixed(1)}
                unit="/ 5"
              />
              <Stat label="Estrés medio" value={avgStress.toFixed(1)} unit="/ 5" />
            </div>
          </section>

          {/* Últimos días */}
          <section className="mt-6">
            <SectionLabel>Últimos días</SectionLabel>
            <div className="mt-1 divide-y divide-border rounded-2xl border border-border bg-surface px-4">
              {ordered.map((d) => (
                <DayRow key={d.id} day={d} />
              ))}
            </div>
          </section>

          {/* Insights cruzados */}
          <section className="mt-6">
            <div className="flex items-center gap-2 text-accent">
              <Icon name="sparkle" size={16} />
              <span className="text-xs font-medium uppercase tracking-[0.12em]">
                Insights cruzados
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              <InsightCard>
                Esta semana entrenó {trained.length} días. Su ánimo fue mejor los
                días posteriores al entrenamiento.
              </InsightCard>
              {worst && (
                <InsightCard>
                  El {worst.label.toLowerCase()} fue su día con menor energía.
                  Durmió {worst.sleepHours} h y no entrenó.
                </InsightCard>
              )}
              <InsightCard>
                Existe una correlación entre sus días de entreno y un mejor estado
                de ánimo.
              </InsightCard>
            </div>
          </section>

          {/* Hábitos */}
          <section className="mt-6">
            <SectionLabel>Hábitos</SectionLabel>
            <div className="mt-2 space-y-2">
              <HabitRow
                label="Entrenamiento"
                detail={`${trained.length} de ${persona.length} días`}
                done={trained.length >= 3}
              />
              <HabitRow
                label="Descanso (7 h o más)"
                detail={`${persona.filter((d) => d.sleepHours >= 7).length} de ${persona.length} días`}
                done={persona.filter((d) => d.sleepHours >= 7).length >= 3}
              />
            </div>
          </section>
        </>
      )}

      <PersonaCheckInModal open={checkIn} onClose={() => setCheckIn(false)} />
    </div>
  );
}

function InsightCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-ink">
      {children}
    </div>
  );
}

function HabitRow({
  label,
  detail,
  done,
}: {
  label: string;
  detail: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          done ? "bg-ok text-white" : "border border-border text-ink-3"
        }`}
      >
        <Icon name="check" size={14} strokeWidth={2.2} />
      </span>
      <span className="flex-1 text-sm text-ink">{label}</span>
      <span className="font-mono text-xs text-ink-2">{detail}</span>
    </div>
  );
}
