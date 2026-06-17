"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import { Sheet } from "@/components/ui/Sheet";
import {
  Button,
  ModuleGlyph,
  NoticeBanner,
  SectionLabel,
} from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/motion";
import { fadeUp } from "@/lib/motion";
import { mockDocuments, type MockDocument } from "@/data/mock/documents";

function AnalysisSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-4 w-48" />
      <div className="space-y-2 rounded-xl border border-border p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  disabled,
  label,
  note,
}: {
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
  label: string;
  note?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className="flex w-full items-start gap-3 py-2 text-left disabled:cursor-default"
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked
            ? "border-accent bg-accent text-white"
            : disabled
              ? "border-border bg-bg"
              : "border-ink-3 bg-surface"
        }`}
      >
        {checked && <Icon name="check" size={13} strokeWidth={2.4} />}
      </span>
      <span className="flex-1">
        <span className={`text-base ${disabled ? "text-ink-3" : "text-ink"}`}>
          {label}
        </span>
        {note && <span className="block text-xs text-ink-3">{note}</span>}
      </span>
    </button>
  );
}

export function DocumentCaptureModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { applyDocumentCapture, setTab } = useApp();
  const [doc, setDoc] = useState<MockDocument | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  function pick(d: MockDocument) {
    setDoc(d);
    setAnalyzing(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAnalyzing(false), 900);
    const init: Record<string, boolean> = {};
    d.keepOptions
      .filter((o) => o.id !== "original")
      .forEach((o) => (init[o.id] = o.default));
    setSelected(init);
  }

  function reset() {
    setDoc(null);
    setAnalyzing(false);
    setSelected({});
  }

  function finish(keptIds: string[]) {
    if (!doc) return;
    applyDocumentCapture(doc.id, keptIds);
    reset();
    onClose();
    setTab("inicio");
  }

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  return (
    <Sheet
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      side="bottom"
      height="88%"
      title={doc ? "Análisis del documento" : "Documentos"}
      headerRight={
        doc ? (
          <button
            onClick={reset}
            className="rounded-full px-2 py-1 text-sm text-accent"
          >
            Atrás
          </button>
        ) : undefined
      }
    >
      <div className="px-5 pb-7">
        {!doc ? (
          <>
            <p className="text-sm text-ink-2">
              Seleccione un documento para analizarlo. En una versión real,
              podría subirlo o fotografiarlo.
            </p>
            <div className="mt-4 space-y-2.5">
              {mockDocuments.map((d) => (
                <motion.button
                  key={d.id}
                  onClick={() => pick(d)}
                  whileTap={{ scale: 0.985 }}
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3.5 text-left transition-colors hover:border-ink-3"
                >
                  <ModuleGlyph icon={d.icon} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-medium text-ink">
                      {d.name}
                    </span>
                    <span className="block truncate text-sm text-ink-3">
                      {d.meta}
                    </span>
                  </span>
                  <Icon name="chevron-right" size={16} className="text-ink-3" />
                </motion.button>
              ))}
            </div>
          </>
        ) : analyzing ? (
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Icon name="sparkle" size={16} />
              <span className="text-xs font-medium uppercase tracking-[0.12em]">
                Analizando «{doc.name}»…
              </span>
            </div>
            <div className="mt-4">
              <AnalysisSkeleton />
            </div>
          </div>
        ) : (
          <motion.div variants={fadeUp} initial="initial" animate="animate">
            {doc.taxNotice && (
              <div className="mb-4">
                <NoticeBanner>
                  Análisis orientativo. Consulte con un profesional para
                  decisiones fiscales.
                </NoticeBanner>
              </div>
            )}

            {/* Analysis */}
            <div className="flex items-center gap-2 text-accent">
              <Icon name="sparkle" size={16} />
              <span className="text-xs font-medium uppercase tracking-[0.12em]">
                Análisis de LifeOS
              </span>
            </div>
            <h3 className="mt-2 text-md font-medium text-ink">
              {doc.analysis.type}
            </h3>

            <dl className="mt-3 divide-y divide-border rounded-xl border border-border">
              {doc.analysis.fields.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <dt className="text-sm text-ink-2">{f.label}</dt>
                  <dd
                    className={`text-sm text-ink ${f.mono ? "font-mono" : "font-medium"}`}
                  >
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <section className="mt-5">
              <SectionLabel>Puntos a revisar</SectionLabel>
              <ul className="mt-2 space-y-2">
                {doc.analysis.review.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-ink">
                    <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-warn" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-5">
              <SectionLabel>Acciones recomendadas</SectionLabel>
              <ul className="mt-2 space-y-2">
                {doc.analysis.actions.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-ink">
                    <span className="mt-0.5 text-accent">
                      <Icon name="arrow-right" size={15} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </section>

            {/* What to keep */}
            <section className="mt-6 rounded-xl border border-border bg-bg p-4">
              <SectionLabel>¿Qué quiere guardar?</SectionLabel>
              <div className="mt-1 divide-y divide-border">
                {doc.keepOptions
                  .filter((o) => o.id !== "original")
                  .map((o) => (
                    <Checkbox
                      key={o.id}
                      label={o.label}
                      checked={!!selected[o.id]}
                      onChange={() =>
                        setSelected((s) => ({ ...s, [o.id]: !s[o.id] }))
                      }
                    />
                  ))}
                <Checkbox
                  label="Documento original"
                  checked={false}
                  disabled
                  note="Por defecto no guardamos el archivo original."
                />
              </div>
            </section>

            {/* Actions — hierarchy: principal / secundario / terciario */}
            <div className="mt-6 space-y-2.5">
              <Button block icon="check" onClick={() => finish(selectedIds)}>
                Guardar lo importante
              </Button>
              <Button
                variant="secondary"
                block
                onClick={() => finish(["resumen"])}
              >
                Analizar y borrar
              </Button>
              <button
                onClick={() => finish([...selectedIds, "original"])}
                className="w-full py-2 text-center text-sm text-ink-2 underline-offset-2 hover:underline"
              >
                Guardar documento completo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Sheet>
  );
}
