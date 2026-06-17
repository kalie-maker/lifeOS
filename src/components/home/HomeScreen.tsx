"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEntities } from "@/components/EntitiesProvider";
import { useToast } from "@/components/ToastProvider";
import { HomeGreeting } from "@/components/HomeGreeting";
import { EntityCard } from "@/components/EntityCard";
import { Button, SectionLabel } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { needsAttention, type StoredEntity } from "@/lib/entities";

const VISIBLE = 3;

function actionFor(e: StoredEntity): string {
  return e.type === "reminder" || e.type === "event" ? "Hecho" : "Archivar";
}

function Section({
  label,
  items,
}: {
  label: string;
  items: StoredEntity[];
}) {
  const { remove } = useEntities();
  const { showToast } = useToast();
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;
  const shown = expanded ? items : items.slice(0, VISIBLE);
  const hidden = items.length - VISIBLE;

  return (
    <section className="mt-7">
      <SectionLabel>{label}</SectionLabel>
      <Stagger className="mt-3 space-y-3">
        {shown.map((e) => (
          <StaggerItem key={e.id}>
            <EntityCard
              entity={e}
              action={{
                label: actionFor(e),
                onClick: () => {
                  remove(e.id);
                  showToast("Hecho");
                },
              }}
            />
          </StaggerItem>
        ))}
      </Stagger>
      {hidden > 0 && !expanded && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpanded(true)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-medium text-accent transition-colors hover:bg-surface"
        >
          Ver todo ({hidden} más)
          <Icon name="chevron-down" size={16} />
        </motion.button>
      )}
    </section>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const { entities, ready } = useEntities();

  const attention = entities.filter(needsAttention);
  const recent = entities.filter((e) => !needsAttention(e));
  const isEmpty = ready && entities.length === 0;

  return (
    <div className="px-5 pb-6 pt-6">
      <header>
        <SectionLabel>Inicio</SectionLabel>
        <h1 className="mt-1 font-display text-display leading-[1.05] text-ink">
          <HomeGreeting />
        </h1>
        <p className="mt-2 text-base text-ink-2">
          Su resumen del día, sin que tenga que buscarlo.
        </p>
      </header>

      {isEmpty ? (
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="mt-8 rounded-2xl border border-border bg-surface p-6 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent">
            <Icon name="sparkle" size={26} />
          </div>
          <h2 className="mt-4 font-display text-xl text-ink">
            Aún no ha capturado nada.
          </h2>
          <p className="mx-auto mt-2 max-w-[17rem] text-sm leading-relaxed text-ink-2">
            Cuéntele algo a LifeOS y lo organizará por usted: vencimientos,
            citas, datos de su casa o su coche.
          </p>
          <div className="mt-5">
            <Button block icon="chat" onClick={() => router.push("/capturar")}>
              Hablar con LifeOS
            </Button>
          </div>
        </motion.div>
      ) : (
        ready && (
          <>
            <Section label="Requiere su atención" items={attention} />
            <Section label="Capturado recientemente" items={recent} />

            <div className="mt-8">
              <Button
                variant="secondary"
                block
                icon="plus"
                onClick={() => router.push("/capturar")}
              >
                Capturar algo nuevo
              </Button>
            </div>
          </>
        )
      )}
    </div>
  );
}
