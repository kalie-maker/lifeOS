"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { tapCard } from "@/lib/motion";
import { VoiceCaptureModal } from "@/components/modals/VoiceCaptureModal";
import { DocumentCaptureModal } from "@/components/modals/DocumentCaptureModal";
import { PhotoCaptureModal } from "@/components/modals/PhotoCaptureModal";

type Flow = "voz" | "documento" | "foto" | null;

const tiles: {
  id: "voz" | "documento" | "foto" | "preguntar";
  label: string;
  icon: IconName;
  hint: string;
}[] = [
  { id: "voz", label: "Voz", icon: "mic", hint: "Cuéntelo en voz alta" },
  { id: "documento", label: "Documento", icon: "document", hint: "Suba un PDF o factura" },
  { id: "foto", label: "Foto", icon: "camera", hint: "Hágale una foto" },
  { id: "preguntar", label: "Preguntar", icon: "chat", hint: "Hable con LifeOS" },
];

export function CaptureScreen() {
  const { openAssistant } = useApp();
  const [flow, setFlow] = useState<Flow>(null);

  return (
    <div className="px-5 pb-6 pt-3">
      <h1 className="font-display text-2xl text-ink">Capturar</h1>
      <p className="mt-1.5 max-w-[18rem] text-base leading-relaxed text-ink-2">
        Háblelo, súbalo o hágale una foto. LifeOS lo entiende.
      </p>

      <Stagger className="mt-6 grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <StaggerItem key={t.id} className="flex">
            <motion.button
              onClick={() =>
                t.id === "preguntar" ? openAssistant() : setFlow(t.id)
              }
              whileTap={tapCard}
              className="group flex w-full flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-ink-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent transition-colors group-hover:bg-[color-mix(in_srgb,var(--color-accent)_12%,transparent)]">
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

      {/* Examples */}
      <div className="mt-8 border-t border-border pt-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-ink-3">
          Ejemplos de uso
        </h2>
        <ul className="mt-3 space-y-2.5">
          {[
            "«¿Cuándo toca la ITV de mi Audi A3 de 2020?»",
            "«Sube tu seguro del coche»",
            "«Foto del salón para ideas de decoración»",
          ].map((ex) => (
            <li
              key={ex}
              className="flex items-start gap-2.5 text-base leading-relaxed text-ink-2"
            >
              <span className="mt-1 text-ink-3">
                <Icon name="sparkle" size={14} />
              </span>
              {ex}
            </li>
          ))}
        </ul>
      </div>

      {/* Privacy footer */}
      <p className="mt-8 text-xs leading-relaxed text-ink-3">
        LifeOS extrae lo importante. Por defecto no guardamos los documentos
        originales.
      </p>

      <VoiceCaptureModal open={flow === "voz"} onClose={() => setFlow(null)} />
      <DocumentCaptureModal
        open={flow === "documento"}
        onClose={() => setFlow(null)}
      />
      <PhotoCaptureModal open={flow === "foto"} onClose={() => setFlow(null)} />
    </div>
  );
}
