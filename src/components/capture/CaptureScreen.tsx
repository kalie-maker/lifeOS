"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Pill, SectionLabel } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { tapCard } from "@/lib/motion";
import { AskSheet } from "./AskSheet";

interface Tile {
  id: "voz" | "documento" | "foto" | "preguntar";
  label: string;
  hint: string;
  icon: IconName;
  ready: boolean;
}

const tiles: Tile[] = [
  { id: "preguntar", label: "Preguntar", hint: "Escríbalo con sus palabras", icon: "chat", ready: true },
  { id: "voz", label: "Voz", hint: "Cuéntelo en voz alta", icon: "mic", ready: false },
  { id: "documento", label: "Documento", hint: "Suba un PDF o factura", icon: "document", ready: false },
  { id: "foto", label: "Foto", hint: "Hágale una foto", icon: "camera", ready: false },
];

export function CaptureScreen() {
  const [askOpen, setAskOpen] = useState(false);

  return (
    <div className="px-5 pb-6 pt-6">
      <header>
        <SectionLabel>Capturar</SectionLabel>
        <h1 className="mt-1 font-display text-2xl text-ink">Capturar</h1>
        <p className="mt-2 max-w-[20rem] text-md leading-relaxed text-ink-2">
          No rellene nada. Háblelo, súbalo o hágale una foto. LifeOS lo
          entiende.
        </p>
      </header>

      <Stagger className="mt-7 grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <StaggerItem key={t.id} className="flex">
            <motion.button
              onClick={() => t.ready && setAskOpen(true)}
              whileTap={t.ready ? tapCard : undefined}
              aria-disabled={!t.ready}
              className={`relative flex w-full flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-colors ${
                t.ready
                  ? "border-border bg-surface hover:border-ink-3"
                  : "cursor-default border-border bg-surface"
              }`}
            >
              {!t.ready && (
                <span className="absolute right-3 top-3">
                  <Pill>Pronto</Pill>
                </span>
              )}
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  t.ready
                    ? "bg-accent text-white"
                    : "bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent"
                }`}
              >
                <Icon name={t.icon} size={24} />
              </span>
              <span>
                <span className="block text-md font-medium text-ink">
                  {t.label}
                </span>
                <span className="block text-sm text-ink-3">{t.hint}</span>
              </span>
            </motion.button>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-ink-3">
        LifeOS extrae lo importante. Por defecto no guardamos los documentos
        originales. La captura por voz, documento y foto llegan en las próximas
        fases.
      </p>

      <AskSheet open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}
