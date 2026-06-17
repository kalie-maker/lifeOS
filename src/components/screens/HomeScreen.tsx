"use client";

import { useState } from "react";
import { useApp } from "@/state/AppContext";
import type { AttentionItem } from "@/state/types";
import { TODAY, TODAY_ISO, greetingDate, timeGreeting } from "@/lib/dates";
import {
  Button,
  Card,
  ModuleGlyph,
  SectionLabel,
  StatusDot,
} from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { spaceIcons } from "@/data/mock/spaces";

const VISIBLE = 2;

function AttentionRow({ item }: { item: AttentionItem }) {
  const { resolveAttention } = useApp();
  const glyph = item.spaceId ? spaceIcons[item.spaceId] : "alert";
  return (
    <Card className="los-rise">
      <div className="flex items-start gap-3.5">
        <div className="relative">
          <ModuleGlyph icon={glyph} size={42} />
          <span className="absolute -right-0.5 -top-0.5">
            <StatusDot severity={item.severity} ring />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-md font-medium text-ink">{item.title}</h3>
          <p className="mt-0.5 text-sm text-ink-2">
            <span className="text-ink-3">{item.module}</span> · {item.description}
          </p>
          <div className="mt-3">
            <Button
              variant={item.severity === "danger" ? "primary" : "secondary"}
              size="sm"
              onClick={() => resolveAttention(item)}
            >
              {item.actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HomeScreen() {
  const {
    name,
    calendar,
    visibleAttention,
    setTab,
    openAssistant,
    setProfileOpen,
  } = useApp();
  const [expanded, setExpanded] = useState(false);

  const today = calendar.filter((e) => e.date === TODAY_ISO);
  const eventos = today.filter((e) => e.type === "evento").length;
  const venc = today.filter((e) => e.type === "vencimiento").length;
  const tareas = today.filter((e) => e.type === "tarea").length;

  const isEmpty =
    calendar.length === 0 && visibleAttention.length === 0;

  const shown = expanded
    ? visibleAttention
    : visibleAttention.slice(0, VISIBLE);
  const hiddenCount = visibleAttention.length - VISIBLE;

  const todayParts: string[] = [];
  if (eventos) todayParts.push(`${eventos} ${eventos === 1 ? "evento" : "eventos"}`);
  if (tareas) todayParts.push(`${tareas} ${tareas === 1 ? "tarea" : "tareas"}`);
  if (venc)
    todayParts.push(`${venc} ${venc === 1 ? "vencimiento" : "vencimientos"}`);

  return (
    <div className="px-5 pb-6 pt-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setProfileOpen(true)}
          aria-label="Perfil y ajustes"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface font-display text-md text-accent transition-colors hover:border-ink-3"
        >
          {name ? name.charAt(0).toUpperCase() : <Icon name="user" size={18} />}
        </button>
        <span className="font-mono text-sm text-ink-3">{greetingDate()}</span>
      </div>

      {/* Greeting */}
      <div className="mt-7">
        <p className="font-display text-2xl leading-tight text-ink-2">
          {timeGreeting(TODAY.getHours() || 16)},
        </p>
        <h1 className="font-display text-display leading-[1.05] text-ink">
          {name || "bienvenido"}.
        </h1>
      </div>

      {isEmpty ? (
        <EmptyHome onStart={() => setTab("capturar")} />
      ) : (
        <>
          {/* Hoy */}
          <Card className="mt-6 los-rise">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Hoy</SectionLabel>
                <p className="mt-1.5 text-md text-ink">
                  {todayParts.length
                    ? todayParts.join(" · ")
                    : "Sin compromisos. Un día tranquilo."}
                </p>
              </div>
              <span className="font-mono text-sm text-ink-3">
                {TODAY.getDate()}
              </span>
            </div>
            <div className="mt-4">
              <Button
                block
                icon="sparkle"
                onClick={() => openAssistant("¿Qué tengo hoy?")}
              >
                Iniciar mi día
              </Button>
            </div>
          </Card>

          {/* Atención */}
          {visibleAttention.length > 0 && (
            <section className="mt-7">
              <SectionLabel>Requiere su atención</SectionLabel>
              <div className="mt-3 space-y-3">
                {shown.map((item) => (
                  <AttentionRow key={item.id} item={item} />
                ))}
              </div>
              {hiddenCount > 0 && !expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-medium text-accent transition-colors hover:bg-surface"
                >
                  Ver todos ({hiddenCount} más)
                  <Icon name="chevron-down" size={16} />
                </button>
              )}
            </section>
          )}

          {/* Acciones */}
          <div className="mt-8 flex gap-3">
            <Button
              variant="secondary"
              block
              icon="chat"
              onClick={() => openAssistant()}
            >
              Hablar con LifeOS
            </Button>
            <Button
              variant="primary"
              icon="plus"
              onClick={() => setTab("capturar")}
              aria-label="Añadir"
            >
              Añadir
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyHome({ onStart }: { onStart: () => void }) {
  return (
    <div className="los-rise mt-8 rounded-2xl border border-border bg-surface p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent">
        <Icon name="sparkle" size={26} />
      </div>
      <h2 className="mt-4 font-display text-xl text-ink">Bienvenido.</h2>
      <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-ink-2">
        Capture su primera información para que LifeOS pueda organizarla. No
        tiene que rellenar nada: háblelo, súbalo o hágale una foto.
      </p>
      <div className="mt-5">
        <Button block icon="plus" onClick={onStart}>
          Empezar a capturar
        </Button>
      </div>
    </div>
  );
}
