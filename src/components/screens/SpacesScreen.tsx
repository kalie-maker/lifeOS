"use client";

import { motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import type { SpaceData } from "@/state/types";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel, StatusDot } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { tapCard } from "@/lib/motion";
import { spaceIcons } from "@/data/mock/spaces";

function spaceSeverity(s: SpaceData): "danger" | "warn" | "ok" {
  const hasDanger = s.sections.some((sec) =>
    sec.rows.some((r) => r.severity === "danger"),
  );
  if (hasDanger) return "danger";
  if (s.alertCount > 0) return "warn";
  return "ok";
}

function SpaceCard({ space }: { space: SpaceData }) {
  const { openSpace } = useApp();
  const sev = spaceSeverity(space);
  const empty = space.itemCount === 0;

  return (
    <motion.button
      onClick={() => openSpace(space.id)}
      whileTap={tapCard}
      className="flex h-full w-full flex-col rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:border-ink-3"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg text-ink-2">
          <Icon name={spaceIcons[space.id]} size={22} />
        </span>
        {!empty && sev !== "ok" && <StatusDot severity={sev} />}
      </div>

      <h3 className="mt-3 text-md font-medium text-ink">{space.name}</h3>
      <p className="mt-0.5 text-xs text-ink-2">{space.status}</p>

      {!empty ? (
        <>
          <p className="mt-2 font-mono text-xs text-ink-3">
            {space.itemCount} elementos · {space.alertCount} alertas
          </p>
          <div className="mt-auto pt-3">
            <p className="text-[11px] uppercase tracking-[0.1em] text-ink-3">
              Próxima acción
            </p>
            <p className="mt-0.5 text-sm leading-snug text-ink">
              {space.nextAction}
            </p>
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm leading-snug text-ink-3">{space.blurb}</p>
      )}
    </motion.button>
  );
}

export function SpacesScreen() {
  const { spacesList } = useApp();

  return (
    <div className="px-5 pb-6 pt-3">
      <h1 className="font-display text-2xl text-ink">Espacios</h1>
      <p className="mt-1.5 text-base text-ink-2">
        Cada ámbito de su vida, organizado por LifeOS.
      </p>

      <Stagger className="mt-6 grid grid-cols-2 gap-3">
        {spacesList.map((s) => (
          <StaggerItem key={s.id} className="flex">
            <SpaceCard space={s} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-6">
        <SectionLabel>Sobre los espacios</SectionLabel>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Lo que captura se reparte solo en su espacio correspondiente. Entre en
          cualquiera para ver el detalle, los análisis y las recomendaciones.
        </p>
      </div>
    </div>
  );
}
