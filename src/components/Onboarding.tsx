"use client";

import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { Button } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";

const reassurance = [
  "Solo unas preguntas breves.",
  "Puede cambiarlo todo más adelante.",
  "Nunca más de 2 minutos.",
];

function Choice({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-base transition-colors ${
        selected
          ? "border-accent bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)] text-ink"
          : "border-border bg-surface text-ink"
      }`}
    >
      {label}
      {selected && (
        <span className="text-accent">
          <Icon name="check" size={18} strokeWidth={2.2} />
        </span>
      )}
    </button>
  );
}

export function Onboarding() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [car, setCar] = useState<string | null>(null);
  const [household, setHousehold] = useState<string | null>(null);
  const [pets, setPets] = useState<string | null>(null);
  const [firstCapture, setFirstCapture] = useState("");
  const [avisos, setAvisos] = useState<string | null>("manana");

  const total = 7;

  function next() {
    setStep((s) => Math.min(s + 1, total - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function finish() {
    completeOnboarding(name.trim() || "Bienvenido", firstCapture);
  }

  const canContinue =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && car) ||
    (step === 2 && household) ||
    (step === 3 && pets) ||
    step === 4 ||
    (step === 5 && avisos);

  return (
    <div className="flex h-full flex-col bg-bg px-6 pb-8 pt-12">
      {/* Progress line */}
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="los-fade-in mt-12 flex-1" key={step}>
        {step === 0 && (
          <>
            <p className="text-sm uppercase tracking-[0.12em] text-ink-3">
              Bienvenido
            </p>
            <h1 className="mt-3 font-display text-2xl leading-tight text-ink">
              Vamos a conocerle para poder ayudarle mejor.
            </h1>
            <p className="mt-3 text-base text-ink-2">¿Cómo se llama?</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canContinue && next()}
              placeholder="Su nombre"
              className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-md text-ink outline-none placeholder:text-ink-3 focus:border-accent"
            />
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="font-display text-2xl leading-tight text-ink">
              ¿Tiene coche?
            </h1>
            <div className="mt-6 space-y-2.5">
              {["Sí", "No", "Añadir después"].map((o) => (
                <Choice
                  key={o}
                  label={o}
                  selected={car === o}
                  onClick={() => setCar(o)}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="font-display text-2xl leading-tight text-ink">
              ¿Vive solo o con familia?
            </h1>
            <div className="mt-6 space-y-2.5">
              {["Solo", "Con mi pareja", "Con mi familia", "Compartido"].map(
                (o) => (
                  <Choice
                    key={o}
                    label={o}
                    selected={household === o}
                    onClick={() => setHousehold(o)}
                  />
                ),
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="font-display text-2xl leading-tight text-ink">
              ¿Tiene mascotas?
            </h1>
            <div className="mt-6 space-y-2.5">
              {["No", "Un perro", "Un gato", "Varias"].map((o) => (
                <Choice
                  key={o}
                  label={o}
                  selected={pets === o}
                  onClick={() => setPets(o)}
                />
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="font-display text-2xl leading-tight text-ink">
              ¿Hay algo que quiera que LifeOS recuerde ya?
            </h1>
            <p className="mt-3 text-base text-ink-2">
              Escríbalo con sus palabras. Es su primera captura.
            </p>
            <textarea
              autoFocus
              value={firstCapture}
              onChange={(e) => setFirstCapture(e.target.value)}
              rows={4}
              placeholder="Por ejemplo: la ITV del coche vence este mes…"
              className="mt-3 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3.5 text-base text-ink outline-none placeholder:text-ink-3 focus:border-accent"
            />
          </>
        )}

        {step === 5 && (
          <>
            <h1 className="font-display text-2xl leading-tight text-ink">
              ¿Cuándo prefiere que le avisemos?
            </h1>
            <div className="mt-6 space-y-2.5">
              {[
                { id: "manana", label: "Por la mañana" },
                { id: "tarde", label: "Por la tarde" },
                { id: "noche", label: "Por la noche" },
              ].map((o) => (
                <Choice
                  key={o.id}
                  label={o.label}
                  selected={avisos === o.id}
                  onClick={() => setAvisos(o.id)}
                />
              ))}
            </div>
          </>
        )}

        {step === 6 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent">
              <Icon name="sparkle" size={30} />
            </span>
            <h1 className="mt-5 font-display text-2xl text-ink">
              LifeOS está listo
              {name.trim() ? `, ${name.trim()}` : ""}.
            </h1>
            <p className="mt-2 max-w-[18rem] text-base text-ink-2">
              Puede capturar su primera información ahora. No tiene que rellenar
              nada: háblelo, súbalo o hágale una foto.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6">
        {step < 6 ? (
          <>
            <div className="flex gap-3">
              {step > 0 && (
                <Button variant="secondary" onClick={back} aria-label="Atrás">
                  <Icon name="chevron-right" size={18} className="rotate-180" />
                </Button>
              )}
              <Button block disabled={!canContinue} onClick={next}>
                {step === 4 && !firstCapture.trim() ? "Omitir por ahora" : "Continuar"}
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-ink-3">
              {reassurance[step % reassurance.length]}
            </p>
          </>
        ) : (
          <Button block icon="plus" onClick={finish}>
            Empezar a capturar
          </Button>
        )}
      </div>
    </div>
  );
}
