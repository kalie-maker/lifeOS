"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEntities } from "@/components/EntitiesProvider";
import { useOnboarding } from "@/components/OnboardingProvider";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel, StatusDot } from "@/components/ui/primitives";
import { Skeleton, Stagger, StaggerItem } from "@/components/ui/motion";
import { tapCard } from "@/lib/motion";
import { needsAttention } from "@/lib/entities";
import { SPACES, onboardingEntities } from "@/lib/spaces";

export function SpacesGrid() {
  const { entities, ready } = useEntities();
  const { data } = useOnboarding();

  return (
    <div className="px-5 pb-6 pt-6">
      <header>
        <SectionLabel>Espacios</SectionLabel>
        <h1 className="mt-1 font-display text-2xl text-ink">Espacios</h1>
        <p className="mt-2 text-base text-ink-2">
          Cada ámbito de su vida, organizado por LifeOS.
        </p>
      </header>

      {!ready ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {SPACES.map((s) => (
            <Skeleton key={s.slug} className="h-44" rounded="rounded-2xl" />
          ))}
        </div>
      ) : (
        <Stagger className="mt-6 grid grid-cols-2 gap-3">
          {SPACES.map((space) => {
            const real = entities.filter((e) => e.space === space.key);
            const synthetic = onboardingEntities(space.key, data);
            const total = real.length + synthetic.length;
            const attention = real.some(needsAttention);
            const preview = real[0]?.title ?? synthetic[0]?.title ?? null;

            return (
              <StaggerItem key={space.slug} className="flex">
                <Link
                  href={`/espacios/${space.slug}`}
                  className="flex w-full"
                  aria-label={`Ver espacio ${space.label}`}
                >
                  <motion.div
                    whileTap={tapCard}
                    className="flex h-full w-full flex-col rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-ink-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg text-ink-2">
                        <Icon name={space.icon} size={22} />
                      </span>
                      {attention && <StatusDot severity="warn" />}
                    </div>

                    <h3 className="mt-3 text-md font-medium text-ink">
                      {space.label}
                    </h3>
                    <p
                      className={`mt-0.5 text-xs ${
                        total === 0 ? "text-ink-3" : "text-ink-2"
                      }`}
                    >
                      {total === 0
                        ? "Sin datos aún"
                        : `${total} ${total === 1 ? "elemento" : "elementos"}`}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-snug text-ink-3">
                      {total === 0 ? space.blurb : preview}
                    </p>

                    <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-medium text-accent">
                      Ver espacio
                      <Icon name="chevron-right" size={15} />
                    </span>
                  </motion.div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
