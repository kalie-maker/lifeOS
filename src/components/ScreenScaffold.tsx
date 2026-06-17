import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ModuleGlyph, Pill, SectionLabel } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";

interface ScreenScaffoldProps {
  eyebrow?: string;
  title?: string;
  /** custom title content (e.g. a client greeting); overrides `title` */
  titleNode?: ReactNode;
  /** render the title in the display serif (used for Inicio) */
  hero?: boolean;
  intro: string;
  icon: IconName;
  /** what this screen will do, in formal "usted" */
  points: string[];
}

export function ScreenScaffold({
  eyebrow,
  title,
  titleNode,
  hero,
  intro,
  icon,
  points,
}: ScreenScaffoldProps) {
  return (
    <div className="px-5 pb-6 pt-6">
      <header>
        {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}
        <h1
          className={`mt-1 font-display text-ink ${
            hero ? "text-display leading-[1.05]" : "text-2xl"
          }`}
        >
          {titleNode ?? title}
        </h1>
        <p className="mt-2 max-w-[22rem] text-base leading-relaxed text-ink-2">
          {intro}
        </p>
      </header>

      <Stagger className="mt-8">
        <StaggerItem className="block rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <ModuleGlyph icon={icon} size={44} tone="accent" />
            <Pill tone="accent">Disponible próximamente</Pill>
          </div>
          <ul className="mt-5 space-y-3">
            {points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-ink"
              >
                <span className="mt-0.5 text-accent">
                  <Icon name="arrow-right" size={15} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </StaggerItem>
      </Stagger>
    </div>
  );
}
