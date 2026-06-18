"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useEntities } from "@/components/EntitiesProvider";
import { useOnboarding } from "@/components/OnboardingProvider";
import { EntityCard } from "@/components/EntityCard";
import { Button } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { Skeleton, Stagger, StaggerItem } from "@/components/ui/motion";
import { fadeUp } from "@/lib/motion";
import { onboardingEntities, type SpaceMeta } from "@/lib/spaces";

export function SpaceDetailScreen({ space }: { space: SpaceMeta }) {
  const router = useRouter();
  const { entities, ready } = useEntities();
  const { data } = useOnboarding();

  const synthetic = onboardingEntities(space.key, data);
  const real = entities.filter((e) => e.space === space.key);
  const total = synthetic.length + real.length;

  return (
    <div className="px-5 pb-6 pt-3">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/espacios"
          aria-label="Volver a Espacios"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface"
        >
          <Icon name="chevron-right" size={20} className="rotate-180" />
        </Link>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg text-ink-2">
          <Icon name={space.icon} size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl leading-none text-ink">
            {space.label}
          </h1>
          <p className="mt-1 truncate text-xs text-ink-2">{space.blurb}</p>
        </div>
      </div>

      {!ready ? (
        <div className="mt-7 space-y-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-24" rounded="rounded-2xl" />
          ))}
        </div>
      ) : total === 0 ? (
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="mt-8 rounded-2xl border border-border bg-surface p-6 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent">
            <Icon name={space.icon} size={26} />
          </div>
          <h2 className="mt-4 font-display text-xl text-ink">
            {space.emptyLine}
          </h2>
          <p className="mx-auto mt-2 max-w-[17rem] text-sm leading-relaxed text-ink-2">
            Capture algo para que LifeOS pueda organizarlo. Háblelo, súbalo o
            hágale una foto.
          </p>
          <div className="mt-5">
            <Button block icon="plus" onClick={() => router.push("/capturar")}>
              Capturar
            </Button>
          </div>
        </motion.div>
      ) : (
        <Stagger className="mt-7 space-y-3">
          {synthetic.map((entity, i) => (
            <StaggerItem key={`onb-${i}`}>
              <EntityCard entity={entity} />
            </StaggerItem>
          ))}
          {real.map((entity) => (
            <StaggerItem key={entity.id}>
              <EntityCard entity={entity} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
