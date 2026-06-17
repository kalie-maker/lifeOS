"use client";

import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { Sheet } from "@/components/ui/Sheet";
import { Button, NoticeBanner, SectionLabel } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { photoScenarios, type PhotoScenario } from "@/data/mock/captures";

/** Abstract SVG stand-in for the captured photo (no real image). */
export function PhotoFrame({
  palette,
  label,
  compact,
}: {
  palette: string[];
  label?: string;
  compact?: boolean;
}) {
  const [a, b, c, d, e] = palette;
  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <svg viewBox="0 0 160 100" className="block w-full" role="img">
        <rect width="160" height="100" fill={a} />
        <rect x="0" y="64" width="160" height="36" fill={c} opacity="0.55" />
        <rect x="14" y="30" width="46" height="40" rx="3" fill={d} />
        <rect x="66" y="20" width="34" height="50" rx="3" fill={b} />
        <rect x="106" y="36" width="40" height="34" rx="3" fill={e} opacity="0.85" />
        <circle cx="130" cy="22" r="9" fill={b} opacity="0.7" />
      </svg>
      {label && (
        <span className="absolute bottom-1.5 left-2 rounded bg-ink/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
          {label}
        </span>
      )}
      {!compact && (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/55 text-white">
          <Icon name="camera" size={13} />
        </span>
      )}
    </div>
  );
}

export function PhotoCaptureModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { applyPhotoCapture, openSpace, setTab } = useApp();
  const [scene, setScene] = useState<PhotoScenario | null>(null);

  function finish() {
    if (!scene) return;
    applyPhotoCapture(scene.id);
    const target = scene.spaceId;
    setScene(null);
    onClose();
    setTab("espacios");
    openSpace(target);
  }

  return (
    <Sheet
      open={open}
      onClose={() => {
        setScene(null);
        onClose();
      }}
      side="bottom"
      height="88%"
      title={scene ? "Análisis de la imagen" : "Foto"}
      headerRight={
        scene ? (
          <button
            onClick={() => setScene(null)}
            className="rounded-full px-2 py-1 text-sm text-accent"
          >
            Atrás
          </button>
        ) : undefined
      }
    >
      <div className="px-5 pb-7">
        {!scene ? (
          <>
            <p className="text-sm text-ink-2">
              Elija una imagen de su galería. LifeOS la analiza y le propone qué
              hacer con ella.
            </p>
            <div className="mt-4 space-y-3">
              {photoScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScene(s)}
                  className="flex w-full items-center gap-3.5 rounded-2xl border border-border bg-surface p-3 text-left transition-colors hover:border-ink-3"
                >
                  <div className="w-28 shrink-0">
                    <PhotoFrame palette={s.palette} compact />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block text-md font-medium text-ink">
                      {s.title}
                    </span>
                    <span className="block text-sm text-ink-3">
                      {s.prompt}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="los-fade-in">
            <PhotoFrame palette={scene.palette} label={scene.title} />

            {/* Question + intent */}
            <div className="mt-4 rounded-xl border border-border bg-bg p-4">
              <p className="text-sm text-ink-2">{scene.question}</p>
              <p className="mt-1.5 text-base text-ink">«{scene.prompt}»</p>
            </div>

            {/* Analysis */}
            <div className="mt-5 flex items-center gap-2 text-accent">
              <Icon name="sparkle" size={16} />
              <span className="text-xs font-medium uppercase tracking-[0.12em]">
                Análisis de LifeOS
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {scene.analysis.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-sm text-ink"
                >
                  <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {line}
                </li>
              ))}
            </ul>

            {scene.notice && (
              <div className="mt-4">
                <NoticeBanner>{scene.notice}</NoticeBanner>
              </div>
            )}

            <div className="mt-5 rounded-xl border border-border bg-bg px-4 py-3">
              <SectionLabel>Presupuesto orientativo</SectionLabel>
              <p className="mt-1 font-mono text-md text-ink">{scene.budget}</p>
            </div>

            <div className="mt-6 space-y-2.5">
              <Button block icon="check" onClick={finish}>
                {scene.primaryAction}
              </Button>
              {scene.secondaryAction && (
                <Button variant="secondary" block icon="search" onClick={finish}>
                  {scene.secondaryAction}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
