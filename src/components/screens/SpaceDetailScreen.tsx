"use client";

import { motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import type { SpaceData, VisualProject } from "@/state/types";
import { Icon } from "@/components/ui/Icon";
import {
  Button,
  NoticeBanner,
  SectionLabel,
  StatusDot,
} from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { ease } from "@/lib/motion";
import { spaceIcons } from "@/data/mock/spaces";
import { PhotoFrame } from "@/components/modals/PhotoCaptureModal";

function ProjectCard({ project }: { project: VisualProject }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <PhotoFrame palette={project.palette} compact />
      <div className="p-4">
        <h4 className="text-md font-medium text-ink">{project.title}</h4>
        <p className="mt-1 text-sm leading-snug text-ink-2">{project.summary}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-sm text-ink">{project.budget}</span>
          <div className="flex gap-1">
            {project.palette.map((c, i) => (
              <span
                key={i}
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpaceDetailScreen({ space }: { space: SpaceData }) {
  const { closeSpace, setTab } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.28, ease } }}
      exit={{ opacity: 0, x: 28, transition: { duration: 0.2, ease } }}
      className="absolute inset-0 z-40 flex flex-col bg-bg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-md">
        <motion.button
          onClick={closeSpace}
          aria-label="Volver"
          whileTap={{ scale: 0.9 }}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-bg"
        >
          <Icon name="chevron-right" size={20} className="rotate-180" />
        </motion.button>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg text-ink-2">
          <Icon name={spaceIcons[space.id]} size={20} />
        </span>
        <div className="flex-1">
          <h1 className="font-display text-xl leading-none text-ink">
            {space.name}
          </h1>
          <p className="mt-0.5 text-xs text-ink-2">{space.status}</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {space.notice && (
          <div className="mb-5">
            <NoticeBanner icon="shield">{space.notice}</NoticeBanner>
          </div>
        )}

        {space.itemCount === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-base text-ink">Este espacio está vacío.</p>
            <p className="mx-auto mt-1.5 max-w-[15rem] text-sm text-ink-2">
              Capture algo relacionado y aparecerá aquí, organizado.
            </p>
            <div className="mt-4">
              <Button
                icon="plus"
                onClick={() => {
                  closeSpace();
                  setTab("capturar");
                }}
              >
                Capturar
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Data sections */}
            <Stagger className="space-y-5">
              {space.sections.map((sec) => (
                <StaggerItem key={sec.title} className="block">
                  <SectionLabel>{sec.title}</SectionLabel>
                  <dl className="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
                    {sec.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-3 px-4 py-2.5"
                      >
                        <dt className="flex items-center gap-2 text-sm text-ink-2">
                          {row.severity && <StatusDot severity={row.severity} size={7} />}
                          {row.label}
                        </dt>
                        {row.value && (
                          <dd
                            className={`text-right text-sm ${
                              row.severity === "danger"
                                ? "text-danger"
                                : row.severity === "warn"
                                  ? "text-warn"
                                  : "text-ink"
                            } ${row.mono ? "font-mono" : "font-medium"}`}
                          >
                            {row.value}
                          </dd>
                        )}
                      </div>
                    ))}
                  </dl>
                </StaggerItem>
              ))}
            </Stagger>

            {/* Visual projects */}
            {space.projects.length > 0 && (
              <section className="mt-6">
                <SectionLabel>Proyectos visuales</SectionLabel>
                <div className="mt-2 space-y-3">
                  {space.projects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            )}

            {/* AI recommendations */}
            {space.insights.length > 0 && (
              <section className="mt-6">
                <div className="flex items-center gap-2 text-accent">
                  <Icon name="sparkle" size={16} />
                  <span className="text-xs font-medium uppercase tracking-[0.12em]">
                    Recomendaciones de LifeOS
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {space.insights.map((ins) => (
                    <div
                      key={ins}
                      className="rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-ink"
                    >
                      {ins}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-7">
              <Button
                block
                variant="secondary"
                icon="plus"
                onClick={() => {
                  closeSpace();
                  setTab("capturar");
                }}
              >
                Añadir a {space.name}
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
