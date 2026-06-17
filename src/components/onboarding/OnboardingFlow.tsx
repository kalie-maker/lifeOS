"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { ease } from "@/lib/motion";
import { useOnboarding } from "@/components/OnboardingProvider";
import {
  assetLabels,
  livingLabels,
  type AssetKey,
  type LivingStatus,
} from "@/lib/onboarding";

const TOTAL = 5;

const stepVariants = {
  enter: (d: number) => ({ opacity: 0, x: d >= 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.28, ease } },
  exit: (d: number) => ({
    opacity: 0,
    x: d >= 0 ? -28 : 28,
    transition: { duration: 0.18, ease },
  }),
};

const livingOptions: { value: LivingStatus; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "pareja", label: "En pareja" },
  { value: "familia", label: "Con familia" },
];

const assetOptions: { key: AssetKey; label: string }[] = [
  { key: "coche", label: "Coche" },
  { key: "moto", label: "Moto" },
  { key: "perro", label: "Perro" },
  { key: "gato", label: "Gato" },
  { key: "otra", label: "Otra mascota" },
];

function Selectable({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-base transition-colors ${
        selected
          ? "border-accent bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)] text-ink"
          : "border-border bg-surface text-ink"
      }`}
    >
      {label}
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-accent"
          >
            <Icon name="check" size={18} strokeWidth={2.2} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-3 last:border-0">
      <span className="text-xs uppercase tracking-[0.1em] text-ink-3">
        {label}
      </span>
      <span className="text-base text-ink">{value}</span>
    </div>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const { complete } = useOnboarding();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const [name, setName] = useState("");
  const [living, setLiving] = useState<LivingStatus | null>(null);
  const [familyCount, setFamilyCount] = useState("");
  const [assets, setAssets] = useState<AssetKey[]>([]);
  const [none, setNone] = useState(false);
  const [freeCapture, setFreeCapture] = useState("");

  function go(delta: number) {
    setDir(delta);
    setStep((s) => Math.min(Math.max(s + delta, 0), TOTAL - 1));
  }

  function toggleAsset(key: AssetKey) {
    setNone(false);
    setAssets((a) => (a.includes(key) ? a.filter((x) => x !== key) : [...a, key]));
  }

  function toggleNone() {
    setNone((n) => !n);
    setAssets([]);
  }

  function finish() {
    complete({
      name: name.trim(),
      livingStatus: living ?? "solo",
      familyCount:
        living === "familia" && familyCount ? Number(familyCount) : undefined,
      assets: none ? [] : assets,
      freeCapture: freeCapture.trim(),
      onboardingCompleted: true,
    });
    router.push("/inicio");
  }

  const canContinue =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 &&
      living !== null &&
      (living !== "familia" || Number(familyCount) >= 1)) ||
    step === 2 ||
    step === 3 ||
    step === 4;

  const assetsSummary =
    none || assets.length === 0
      ? "Ninguno"
      : assets.map((k) => assetLabels[k]).join(", ");

  return (
    <div className="absolute inset-0 flex flex-col bg-bg px-6 pb-8 pt-12">
      {/* Progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span
            key={i}
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-border"
          >
            <motion.span
              className="block h-full origin-left rounded-full bg-accent"
              initial={false}
              animate={{ scaleX: i <= step ? 1 : 0 }}
              transition={{ duration: 0.4, ease }}
            />
          </span>
        ))}
      </div>

      {/* Step content */}
      <div className="relative mt-12 flex-1">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="h-full"
          >
            {step === 0 && (
              <>
                <p className="text-sm uppercase tracking-[0.12em] text-ink-3">
                  Bienvenido a LifeOS
                </p>
                <h1 className="mt-3 font-display text-2xl leading-tight text-ink">
                  ¿Cómo se llama?
                </h1>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue && go(1)}
                  placeholder="Su nombre..."
                  className="mt-5 w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-md text-ink outline-none placeholder:text-ink-3 focus:border-accent"
                />
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="font-display text-2xl leading-tight text-ink">
                  ¿Vive solo o acompañado?
                </h1>
                <div className="mt-6 space-y-2.5">
                  {livingOptions.map((o) => (
                    <Selectable
                      key={o.value}
                      label={o.label}
                      selected={living === o.value}
                      onClick={() => setLiving(o.value)}
                    />
                  ))}
                </div>
                <AnimatePresence>
                  {living === "familia" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="mt-5 block text-sm text-ink-2">
                        ¿Cuántas personas?
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={familyCount}
                        onChange={(e) => setFamilyCount(e.target.value)}
                        placeholder="Ej.: 4"
                        className="mt-2 w-28 rounded-xl border border-border bg-surface px-4 py-3 text-center font-mono text-md text-ink outline-none placeholder:text-ink-3 focus:border-accent"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="font-display text-2xl leading-tight text-ink">
                  ¿Tiene coche, moto o mascotas?
                </h1>
                <p className="mt-2 text-base text-ink-2">
                  Puede elegir varias opciones.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2.5">
                  {assetOptions.map((o) => (
                    <Selectable
                      key={o.key}
                      label={o.label}
                      selected={!none && assets.includes(o.key)}
                      onClick={() => toggleAsset(o.key)}
                    />
                  ))}
                </div>
                <div className="mt-2.5">
                  <Selectable
                    label="Ninguno"
                    selected={none}
                    onClick={toggleNone}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="font-display text-2xl leading-tight text-ink">
                  ¿Hay algo importante que LifeOS deba saber ya?
                </h1>
                <textarea
                  autoFocus
                  value={freeCapture}
                  onChange={(e) => setFreeCapture(e.target.value)}
                  rows={5}
                  placeholder="Por ejemplo: el seguro del coche vence en octubre, tengo un perro de 8 años, el alquiler lo pago el día 5..."
                  className="mt-5 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3.5 text-base leading-relaxed text-ink outline-none placeholder:text-ink-3 focus:border-accent"
                />
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="font-display text-2xl leading-tight text-ink">
                  Esto es lo que LifeOS ha entendido:
                </h1>
                <div className="mt-5 rounded-2xl border border-border bg-surface px-5 py-2">
                  <SummaryRow label="Nombre" value={name.trim() || "—"} />
                  <SummaryRow
                    label="Convivencia"
                    value={
                      living
                        ? livingLabels[living] +
                          (living === "familia" && familyCount
                            ? ` · ${familyCount} personas`
                            : "")
                        : "—"
                    }
                  />
                  <SummaryRow label="Coche y mascotas" value={assetsSummary} />
                  <SummaryRow
                    label="Lo primero que debo recordar"
                    value={freeCapture.trim() || "Nada por ahora"}
                  />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-6">
        {step < TOTAL - 1 ? (
          <>
            <div className="flex gap-3">
              {step > 0 && (
                <Button variant="secondary" onClick={() => go(-1)} aria-label="Atrás">
                  <Icon name="chevron-right" size={18} className="rotate-180" />
                </Button>
              )}
              <Button block disabled={!canContinue} onClick={() => go(1)}>
                Continuar
              </Button>
            </div>
            {step === 3 && (
              <button
                onClick={() => {
                  setFreeCapture("");
                  go(1);
                }}
                className="mt-3 block w-full text-center text-sm text-ink-3 underline-offset-2 hover:underline"
              >
                Ahora no
              </button>
            )}
          </>
        ) : (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => go(-1)} aria-label="Atrás">
              <Icon name="chevron-right" size={18} className="rotate-180" />
            </Button>
            <Button block icon="check" onClick={finish}>
              Empezar a usar LifeOS
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
