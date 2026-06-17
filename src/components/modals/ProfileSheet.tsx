"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/state/AppContext";
import { Sheet } from "@/components/ui/Sheet";
import { Button, Pill, SectionLabel } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/motion";

type View = "menu" | "biblioteca" | "privacidad" | "avisos";

const privacyMessages = [
  "LifeOS nunca escucha sin permiso.",
  "Puede borrar cualquier dato en cualquier momento.",
  "Sus documentos son suyos.",
  "Por defecto no guardamos documentos originales.",
  "Los análisis son orientativos.",
];

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-bg"
    >
      <span className={danger ? "text-danger" : "text-ink-2"}>
        <Icon name={icon} size={20} />
      </span>
      <span className={`flex-1 text-base ${danger ? "text-danger" : "text-ink"}`}>
        {label}
      </span>
      <Icon name="chevron-right" size={16} className="text-ink-3" />
    </motion.button>
  );
}

export function ProfileSheet() {
  const {
    profileOpen,
    setProfileOpen,
    name,
    library,
    resetNew,
    loadDemo,
    completeOnboarding,
    showToast,
  } = useApp();
  const [view, setView] = useState<View>("menu");
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [avisos, setAvisos] = useState("manana");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function close() {
    setProfileOpen(false);
    setView("menu");
    setEditing(false);
    setConfirmDelete(false);
  }

  return (
    <Sheet
      open={profileOpen}
      onClose={close}
      side="right"
      title={view === "menu" ? "Perfil" : undefined}
      headerRight={
        view !== "menu" ? (
          <button
            onClick={() => setView("menu")}
            className="rounded-full px-2 py-1 text-sm text-accent"
          >
            Atrás
          </button>
        ) : undefined
      }
    >
      <div className="px-4 pb-8">
        {view === "menu" && (
          <>
            {/* Profile header */}
            <div className="flex items-center gap-3 px-1 py-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg font-display text-xl text-accent">
                {name ? name.charAt(0).toUpperCase() : "?"}
              </span>
              <div className="flex-1">
                {editing ? (
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-bg px-2 py-1 text-md text-ink outline-none focus:border-accent"
                  />
                ) : (
                  <p className="text-md font-medium text-ink">{name}</p>
                )}
                <p className="text-sm text-ink-3">kaliricoteperez@gmail.com</p>
              </div>
              {editing ? (
                <button
                  onClick={() => {
                    completeOnboarding(draftName.trim() || name);
                    setEditing(false);
                  }}
                  className="text-sm font-medium text-accent"
                >
                  Guardar
                </button>
              ) : (
                <button
                  onClick={() => {
                    setDraftName(name);
                    setEditing(true);
                  }}
                  aria-label="Editar nombre"
                  className="text-ink-2"
                >
                  <Icon name="edit" size={18} />
                </button>
              )}
            </div>

            <div className="mt-4 space-y-0.5">
              <MenuItem icon="bell" label="Ajustes de avisos" onClick={() => setView("avisos")} />
              <MenuItem icon="lock" label="Privacidad" onClick={() => setView("privacidad")} />
              <MenuItem
                icon="library"
                label="Biblioteca de análisis"
                onClick={() => setView("biblioteca")}
              />
              <MenuItem
                icon="download"
                label="Exportar mis datos"
                onClick={() => {
                  close();
                  showToast("Sus datos se han preparado para exportar");
                }}
              />
            </div>

            <div className="my-4 h-px bg-border" />

            <div className="space-y-0.5">
              {confirmDelete ? (
                <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-danger)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_5%,transparent)] p-4">
                  <p className="text-sm text-ink">
                    ¿Seguro? Esto borrará todos sus datos y volverá al inicio
                    como usuario nuevo.
                  </p>
                  <div className="mt-3 flex gap-2.5">
                    <Button
                      variant="danger"
                      block
                      size="sm"
                      onClick={() => {
                        close();
                        resetNew();
                      }}
                    >
                      Sí, borrar todo
                    </Button>
                    <Button
                      variant="secondary"
                      block
                      size="sm"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <MenuItem
                  icon="trash"
                  label="Borrar mis datos"
                  danger
                  onClick={() => setConfirmDelete(true)}
                />
              )}
              <MenuItem icon="logout" label="Cerrar sesión" onClick={close} />
            </div>

            <button
              onClick={() => {
                close();
                loadDemo();
              }}
              className="mt-6 w-full text-center text-xs text-ink-3 underline-offset-2 hover:underline"
            >
              Restablecer datos de ejemplo
            </button>
          </>
        )}

        {view === "biblioteca" && (
          <div className="los-fade-in">
            <h2 className="font-display text-xl text-ink">Biblioteca de análisis</h2>
            <p className="mt-1 text-sm text-ink-2">
              Todo lo que LifeOS ha procesado para usted.
            </p>
            {library.length === 0 ? (
              <p className="mt-6 text-sm text-ink-3">
                Todavía no ha analizado ningún documento.
              </p>
            ) : (
              <Stagger className="mt-4 space-y-3">
                {library.map((doc) => (
                  <StaggerItem
                    key={doc.id}
                    className="rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-ink">
                        {doc.name}
                      </h3>
                      <span className="font-mono text-xs text-ink-3">
                        {doc.date}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-2">
                      {doc.type} · {doc.module}
                    </p>
                    <p className="mt-2 text-sm leading-snug text-ink">
                      {doc.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Pill tone="neutral">
                        {doc.originalKept
                          ? "Archivo original guardado"
                          : "Archivo original no guardado"}
                      </Pill>
                      {doc.reminderCreated && (
                        <Pill tone="accent">Recordatorio creado</Pill>
                      )}
                      {doc.needsReview && (
                        <Pill tone="warn">Pendiente de revisar</Pill>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        )}

        {view === "privacidad" && (
          <div className="los-fade-in">
            <h2 className="font-display text-xl text-ink">Privacidad</h2>
            <div className="mt-4 space-y-2.5">
              {privacyMessages.map((m) => (
                <div
                  key={m}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
                >
                  <span className="mt-0.5 text-ok">
                    <Icon name="shield" size={18} />
                  </span>
                  <span className="text-sm text-ink">{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "avisos" && (
          <div className="los-fade-in">
            <h2 className="font-display text-xl text-ink">Ajustes de avisos</h2>
            <p className="mt-1 text-sm text-ink-2">
              ¿Cuándo prefiere que le avisemos?
            </p>
            <div className="mt-4 space-y-2">
              {[
                { id: "manana", label: "Por la mañana", hint: "Al empezar el día" },
                { id: "tarde", label: "Por la tarde", hint: "A media jornada" },
                { id: "noche", label: "Por la noche", hint: "Para preparar el día siguiente" },
              ].map((o) => (
                <button
                  key={o.id}
                  onClick={() => setAvisos(o.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    avisos === o.id ? "border-accent bg-surface" : "border-border bg-surface"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      avisos === o.id ? "border-accent" : "border-ink-3"
                    }`}
                  >
                    {avisos === o.id && (
                      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="block text-base text-ink">{o.label}</span>
                    <span className="block text-xs text-ink-3">{o.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
