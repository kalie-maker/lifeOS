"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Sheet } from "@/components/ui/Sheet";
import { Button, SectionLabel } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { EntityCard } from "@/components/EntityCard";
import { useEntities } from "@/components/EntitiesProvider";
import { useToast } from "@/components/ToastProvider";
import type { CaptureEntity, CaptureResult, EntityType } from "@/lib/entities";

type Phase = "input" | "loading" | "result" | "error";

const PLACEHOLDER =
  "Cuéntele algo a LifeOS. Por ejemplo: el seguro del coche vence en octubre, tengo médico el viernes a las 10, o recuérdame revisar la factura de la luz...";

export function AskSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { addEntities } = useEntities();
  const { showToast } = useToast();

  const [phase, setPhase] = useState<Phase>("input");
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<CaptureEntity[]>([]);
  const [result, setResult] = useState<CaptureResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Fresh state each time the sheet opens.
  useEffect(() => {
    if (open) {
      setPhase("input");
      setText("");
      setDraft([]);
      setResult(null);
      setErrorMsg("");
    }
  }, [open]);

  async function send() {
    const value = text.trim();
    if (!value) return;
    setPhase("loading");
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data?.message ?? "No se ha podido procesar. Inténtelo de nuevo.",
        );
        setPhase("error");
        return;
      }
      setResult(data as CaptureResult);
      setDraft((data as CaptureResult).entities);
      setPhase("result");
    } catch {
      setErrorMsg("No hay conexión con el servidor. Inténtelo de nuevo.");
      setPhase("error");
    }
  }

  function changeType(index: number, next: EntityType) {
    setDraft((prev) =>
      prev.map((e, i) => (i === index ? { ...e, type: next } : e)),
    );
  }

  function saveAll() {
    if (draft.length > 0) addEntities(draft);
    showToast("Guardado en LifeOS");
    onClose();
    router.push("/inicio");
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="bottom"
      height="84%"
      title="Preguntar a LifeOS"
    >
      <div className="px-5 pb-8">
        {phase === "input" && (
          <>
            <p className="text-sm leading-relaxed text-ink-2">
              No rellene nada. Escriba con sus palabras y LifeOS extraerá lo
              importante.
            </p>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder={PLACEHOLDER}
              className="mt-4 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3.5 text-base leading-relaxed text-ink outline-none placeholder:text-ink-3 focus:border-accent"
            />
            <div className="mt-4">
              <Button block icon="sparkle" disabled={!text.trim()} onClick={send}>
                Enviar a LifeOS
              </Button>
            </div>
          </>
        )}

        {phase === "loading" && (
          <div className="flex flex-col items-center py-16">
            <motion.span
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent"
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon name="sparkle" size={28} />
            </motion.span>
            <p className="mt-5 text-md text-ink">LifeOS está procesando…</p>
            <p className="mt-1 text-sm text-ink-3">
              Extrayendo lo importante de su texto.
            </p>
          </div>
        )}

        {phase === "result" && result && (
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Icon name="sparkle" size={16} />
              <span className="text-xs font-medium uppercase tracking-[0.12em]">
                Esto es lo que LifeOS ha entendido
              </span>
            </div>
            {result.summary && (
              <p className="mt-2 text-base leading-relaxed text-ink">
                {result.summary}
              </p>
            )}

            {draft.length > 0 ? (
              <Stagger className="mt-4 space-y-3">
                {draft.map((entity, i) => (
                  <StaggerItem key={i}>
                    <EntityCard
                      entity={entity}
                      onChangeType={(next) => changeType(i, next)}
                    />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <p className="mt-4 rounded-xl border border-border bg-bg p-4 text-sm text-ink-2">
                LifeOS no ha encontrado nada que guardar. Pruebe a darle más
                detalle.
              </p>
            )}

            {result.pending_questions.length > 0 && (
              <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--color-warn)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-warn)_7%,transparent)] p-4">
                <SectionLabel>LifeOS necesita saber</SectionLabel>
                <ul className="mt-2 space-y-1.5">
                  {result.pending_questions.map((q) => (
                    <li
                      key={q}
                      className="flex items-start gap-2 text-sm text-[#7a4208]"
                    >
                      <span className="mt-[3px]">
                        <Icon name="alert" size={13} />
                      </span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 space-y-2.5">
              <Button
                block
                icon="check"
                disabled={draft.length === 0}
                onClick={saveAll}
              >
                Guardar todo
              </Button>
              <Button variant="secondary" block onClick={() => setPhase("input")}>
                Editar
              </Button>
              <button
                onClick={onClose}
                className="w-full py-2 text-center text-sm text-ink-2 underline-offset-2 hover:underline"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="py-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-warn)_10%,transparent)] text-warn">
              <Icon name="alert" size={24} />
            </span>
            <p className="mx-auto mt-4 max-w-[18rem] text-base text-ink">
              {errorMsg}
            </p>
            <div className="mt-6">
              <Button block onClick={() => setPhase("input")}>
                Volver a intentarlo
              </Button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
