"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import { Sheet } from "@/components/ui/Sheet";
import { Button, SectionLabel } from "@/components/ui/primitives";
import type { Mood, Workout } from "@/state/types";
import { TODAY, TODAY_ISO } from "@/lib/dates";
import { moodLabels, workoutLabels } from "@/data/mock/persona";

const moods: Mood[] = ["muy-bajo", "bajo", "normal", "bueno", "excelente"];
const workouts: Workout[] = [
  "ninguno",
  "tren-superior",
  "pierna",
  "cardio",
  "full-body",
  "otro",
];
const WD = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const energyWords = ["", "Muy baja", "Baja", "Normal", "Alta", "Muy alta"];
const stressWords = ["", "Muy bajo", "Bajo", "Moderado", "Alto", "Muy alto"];

function Slider({
  value,
  onChange,
  words,
}: {
  value: number;
  onChange: (v: number) => void;
  words: string[];
}) {
  return (
    <div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#1b3a6b]"
      />
      <div className="mt-1 text-sm font-medium text-ink">{words[value]}</div>
    </div>
  );
}

export function PersonaCheckInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { registerPersona } = useApp();
  const [mood, setMood] = useState<Mood>("normal");
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [workout, setWorkout] = useState<Workout>("ninguno");
  const [note, setNote] = useState("");

  function save() {
    registerPersona({
      date: TODAY_ISO,
      label: WD[TODAY.getDay()],
      sleepHours: sleep,
      mood,
      energy,
      stress,
      workout,
      note: note.trim() || undefined,
    });
    onClose();
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="bottom"
      height="90%"
      title="¿Cómo se encuentra hoy?"
    >
      <div className="space-y-6 px-5 pb-8">
        {/* Mood */}
        <div>
          <SectionLabel>Estado de ánimo</SectionLabel>
          <div className="mt-2 flex gap-1.5">
            {moods.map((m) => (
              <motion.button
                key={m}
                onClick={() => setMood(m)}
                whileTap={{ scale: 0.92 }}
                className={`flex-1 rounded-xl border px-1 py-2.5 text-xs leading-tight transition-colors ${
                  mood === m
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface text-ink-2"
                }`}
              >
                {moodLabels[m]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div>
          <SectionLabel>Energía</SectionLabel>
          <div className="mt-2">
            <Slider value={energy} onChange={setEnergy} words={energyWords} />
          </div>
        </div>

        {/* Sleep */}
        <div>
          <SectionLabel>Horas de sueño</SectionLabel>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={14}
              step={0.5}
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              className="w-24 rounded-xl border border-border bg-bg px-3 py-2.5 text-center font-mono text-md text-ink outline-none focus:border-accent"
            />
            <span className="text-sm text-ink-2">horas anoche</span>
          </div>
        </div>

        {/* Stress */}
        <div>
          <SectionLabel>Nivel de estrés</SectionLabel>
          <div className="mt-2">
            <Slider value={stress} onChange={setStress} words={stressWords} />
          </div>
        </div>

        {/* Workout */}
        <div>
          <SectionLabel>Entrenamiento hoy</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-2">
            {workouts.map((w) => (
              <motion.button
                key={w}
                onClick={() => setWorkout(w)}
                whileTap={{ scale: 0.94 }}
                className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                  workout === w
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface text-ink-2"
                }`}
              >
                {w === "ninguno" ? "No he entrenado" : workoutLabels[w]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <SectionLabel>Nota (opcional)</SectionLabel>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Cómo se ha sentido hoy…"
            className="mt-2 w-full resize-none rounded-xl border border-border bg-bg px-3.5 py-3 text-base text-ink outline-none placeholder:text-ink-3 focus:border-accent"
          />
        </div>

        <Button block icon="check" onClick={save}>
          Guardar registro
        </Button>
      </div>
    </Sheet>
  );
}
