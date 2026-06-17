"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Button, ModuleGlyph, Pill } from "@/components/ui/primitives";
import {
  entityTypeIcon,
  entityTypeLabel,
  entityTypes,
  formatEntityDate,
  spaceIcon,
  spaceLabel,
  type CaptureEntity,
  type EntityType,
} from "@/lib/entities";

function nextType(t: EntityType): EntityType {
  const i = entityTypes.indexOf(t);
  return entityTypes[(i + 1) % entityTypes.length];
}

export function EntityCard({
  entity,
  onChangeType,
  action,
}: {
  entity: CaptureEntity;
  /** when provided, the type chip becomes editable (cycles on tap) */
  onChangeType?: (next: EntityType) => void;
  action?: { label: string; onClick: () => void };
}) {
  const dateValue = entity.date ?? entity.expiry_date;
  const dateLabel = formatEntityDate(dateValue);
  const datePrefix = !entity.date && entity.expiry_date ? "Vence " : "";

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <ModuleGlyph icon={entityTypeIcon[entity.type]} size={40} tone="accent" />
        <div className="min-w-0 flex-1">
          <h3 className="text-md font-medium leading-snug text-ink">
            {entity.title}
          </h3>
          {entity.description && (
            <p className="mt-0.5 text-sm leading-snug text-ink-2">
              {entity.description}
            </p>
          )}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Pill>
              <Icon name={spaceIcon[entity.space]} size={12} />
              {spaceLabel[entity.space]}
            </Pill>
            {dateLabel && (
              <Pill tone="accent">
                <Icon name="clock" size={12} />
                {datePrefix}
                {dateLabel}
              </Pill>
            )}
            {onChangeType ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => onChangeType(nextType(entity.type))}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-ink-3 px-2.5 py-0.5 text-xs font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent"
                aria-label="Cambiar tipo"
              >
                {entityTypeLabel[entity.type]}
                <Icon name="edit" size={11} />
              </motion.button>
            ) : (
              <Pill>{entityTypeLabel[entity.type]}</Pill>
            )}
          </div>
        </div>
        {action && (
          <Button variant="secondary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
