"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import type { Severity } from "@/lib/types";
import { T, tap, tapCard } from "@/lib/motion";
import { Icon, type IconName } from "./Icon";

/* ------------------------------------------------------------------ */
/*  Button                                                             */
/* ------------------------------------------------------------------ */
type ButtonVariant = "primary" | "secondary" | "text" | "danger" | "gold";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-2 shadow-[0_1px_2px_rgba(27,58,107,0.18)]",
  secondary: "bg-surface text-ink border border-border hover:border-ink-3",
  text: "bg-transparent text-accent hover:text-accent-2",
  danger:
    "bg-transparent text-danger border border-[color-mix(in_srgb,var(--color-danger)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-danger)_6%,transparent)]",
  gold: "bg-gold text-ink hover:opacity-90",
};

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  block?: boolean;
  icon?: IconName;
  size?: "sm" | "md";
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  block,
  icon,
  size = "md",
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const pad =
    variant === "text"
      ? "px-1 py-1"
      : size === "sm"
        ? "px-3.5 py-2"
        : "px-4 py-3";
  return (
    <motion.button
      disabled={disabled}
      whileTap={disabled ? undefined : tap}
      transition={T.press}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${pad} ${
        size === "sm" ? "text-sm" : "text-base"
      } ${buttonStyles[variant]} ${block ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  const base = `block w-full rounded-2xl border border-border bg-surface p-5 text-left ${className}`;
  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        whileTap={tapCard}
        transition={T.press}
        className={`${base} transition-colors duration-200 hover:border-ink-3`}
      >
        {children}
      </motion.button>
    );
  }
  return <div className={base}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/*  Section label — small uppercase eyebrow                            */
/* ------------------------------------------------------------------ */
export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-xs font-medium uppercase tracking-[0.12em] text-ink-3 ${className}`}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Status dot — the only place colour signals urgency                 */
/* ------------------------------------------------------------------ */
const dotColor: Record<Severity | "ok", string> = {
  danger: "var(--color-danger)",
  warn: "var(--color-warn)",
  info: "var(--color-accent)",
  ok: "var(--color-ok)",
};

export function StatusDot({
  severity,
  size = 9,
  ring,
}: {
  severity: Severity | "ok";
  size?: number;
  ring?: boolean;
}) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: dotColor[severity],
        boxShadow: ring
          ? `0 0 0 4px color-mix(in srgb, ${dotColor[severity]} 16%, transparent)`
          : undefined,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Pill / tag                                                         */
/* ------------------------------------------------------------------ */
export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "warn" | "ok" | "gold";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-bg text-ink-2 border-border",
    accent:
      "bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)]",
    warn: "bg-[color-mix(in_srgb,var(--color-warn)_9%,transparent)] text-warn border-[color-mix(in_srgb,var(--color-warn)_22%,transparent)]",
    ok: "bg-[color-mix(in_srgb,var(--color-ok)_9%,transparent)] text-ok border-[color-mix(in_srgb,var(--color-ok)_22%,transparent)]",
    gold: "bg-[color-mix(in_srgb,var(--color-gold)_14%,transparent)] text-[#8a7124] border-[color-mix(in_srgb,var(--color-gold)_34%,transparent)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Notice banner — advisories (vet / tax disclaimers)                 */
/* ------------------------------------------------------------------ */
export function NoticeBanner({
  children,
  tone = "warn",
  icon = "alert",
}: {
  children: ReactNode;
  tone?: "warn" | "neutral";
  icon?: IconName;
}) {
  const styles =
    tone === "warn"
      ? "bg-[color-mix(in_srgb,var(--color-warn)_7%,transparent)] border-[color-mix(in_srgb,var(--color-warn)_22%,transparent)] text-[#7a4208]"
      : "bg-bg border-border text-ink-2";
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-snug ${styles}`}
    >
      <span className="mt-0.5 shrink-0">
        <Icon name={icon} size={16} />
      </span>
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Module glyph — tinted square holding a module icon                 */
/* ------------------------------------------------------------------ */
export function ModuleGlyph({
  icon,
  size = 40,
  tone = "neutral",
}: {
  icon: IconName;
  size?: number;
  tone?: "neutral" | "accent";
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${
        tone === "accent"
          ? "bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent"
          : "bg-bg text-ink-2 border border-border"
      }`}
      style={{ width: size, height: size }}
    >
      <Icon name={icon} size={size * 0.5} />
    </span>
  );
}
