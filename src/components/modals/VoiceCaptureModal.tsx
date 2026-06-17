"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/state/AppContext";
import { Sheet } from "@/components/ui/Sheet";
import { Button, ModuleGlyph, SectionLabel } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import {
  voiceResults,
  voiceTranscript,
  type LineTag,
} from "@/data/mock/captures";

type Phase = "listening" | "transcript" | "analysis";

const tagColor: Record<LineTag, string> = {
  ok: "var(--color-ok)",
  warn: "var(--color-warn)",
  info: "var(--color-accent)",
  pending: "var(--color-ink-3)",
};

export function VoiceCaptureModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { applyVoiceCapture, setTab } = useApp();
  const [phase, setPhase] = useState<Phase>("listening");
  const [typed, setTyped] = useState("");
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
  }

  // Reset when (re)opened.
  useEffect(() => {
    if (!open) {
      clearTimers();
      setPhase("listening");
      setTyped("");
      return;
    }
    const start = window.setTimeout(() => setPhase("transcript"), 1100);
    timers.current.push(start);
    return clearTimers;
  }, [open]);

  // Typewriter while transcribing.
  useEffect(() => {
    if (phase !== "transcript") return;
    let i = typed.length;
    const id = window.setInterval(() => {
      i += 2;
      if (i >= voiceTranscript.length) {
        setTyped(voiceTranscript);
        window.clearInterval(id);
      } else {
        setTyped(voiceTranscript.slice(0, i));
      }
    }, 24);
    timers.current.push(id);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const typingDone = typed.length >= voiceTranscript.length;

  function confirm() {
    applyVoiceCapture();
    onClose();
    setTab("inicio");
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="bottom"
      height="86%"
      title="Captura por voz"
    >
      <div className="px-5 pb-7">
        {/* Mic + status */}
        {phase !== "analysis" && (
          <div className="flex flex-col items-center py-6">
            <button
              onClick={() => {
                if (phase === "listening") setPhase("transcript");
                else if (!typingDone) setTyped(voiceTranscript);
              }}
              aria-label="Micrófono"
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white"
            >
              {phase === "listening" && (
                <>
                  <span
                    className="absolute inset-0 rounded-full bg-accent"
                    style={{ animation: "los-pulse-ring 1.8s ease-out infinite" }}
                  />
                  <span
                    className="absolute inset-0 rounded-full bg-accent"
                    style={{
                      animation: "los-pulse-ring 1.8s ease-out 0.9s infinite",
                    }}
                  />
                </>
              )}
              <Icon name="mic" size={30} className="relative" />
            </button>
            <p className="mt-4 text-sm text-ink-2">
              {phase === "listening"
                ? "Escuchando… hable con naturalidad."
                : typingDone
                  ? "Transcripción completa."
                  : "Transcribiendo…"}
            </p>
          </div>
        )}

        {/* Transcript */}
        {phase === "transcript" && (
          <div className="rounded-xl border border-border bg-bg p-4">
            <p className="text-base leading-relaxed text-ink">
              {typed}
              {!typingDone && (
                <span
                  className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-0.5 bg-accent align-middle"
                  style={{ animation: "los-caret 1s step-end infinite" }}
                />
              )}
            </p>
          </div>
        )}

        {phase === "transcript" && typingDone && (
          <div className="mt-5">
            <Button block icon="sparkle" onClick={() => setPhase("analysis")}>
              Analizar con LifeOS
            </Button>
          </div>
        )}

        {/* Analysis */}
        {phase === "analysis" && (
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Icon name="sparkle" size={16} />
              <span className="text-xs font-medium uppercase tracking-[0.12em]">
                Análisis de LifeOS
              </span>
            </div>

            <div className="los-stagger mt-4 space-y-4">
              {voiceResults.map((mod) => (
                <div
                  key={mod.module}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-2.5">
                    <ModuleGlyph icon={mod.icon} size={32} tone="accent" />
                    <SectionLabel>{mod.module}</SectionLabel>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {mod.lines.map((line, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        {line.tag === "pending" ? (
                          <span
                            className="mt-[5px] h-2 w-2 shrink-0 rounded-full border"
                            style={{ borderColor: tagColor.pending }}
                          />
                        ) : (
                          <span
                            className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                            style={{
                              backgroundColor: tagColor[line.tag ?? "info"],
                            }}
                          />
                        )}
                        <span
                          className={
                            line.tag === "pending" ? "text-ink-2" : "text-ink"
                          }
                        >
                          {line.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2.5">
              <Button block icon="check" onClick={confirm}>
                Confirmar y guardar
              </Button>
              <div className="flex gap-2.5">
                <Button
                  variant="secondary"
                  block
                  onClick={() => setPhase("transcript")}
                >
                  Corregir
                </Button>
                <Button
                  variant="secondary"
                  block
                  onClick={() => {
                    setTyped("");
                    setPhase("listening");
                  }}
                >
                  Añadir más
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
