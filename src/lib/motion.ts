// ------------------------------------------------------------------
//  Shared motion system. Premium, restrained, transform/opacity only.
//  One source of truth so every surface feels part of the same product.
// ------------------------------------------------------------------
import type { Transition, Variants } from "motion/react";

/** Calm, decelerating ease — the LifeOS signature curve. */
export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const easeInOut: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const T = {
  swift: { duration: 0.2, ease },
  soft: { duration: 0.26, ease },
  gentle: { duration: 0.32, ease },
  /** for physical surfaces (sheets) */
  sheet: { type: "spring", stiffness: 360, damping: 38, mass: 0.9 },
  /** for taps / presses */
  press: { type: "spring", stiffness: 500, damping: 30, mass: 0.6 },
} satisfies Record<string, Transition>;

// ── Screen (tab) transitions — fade + slight slide ───────────────────
export const screenVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.26, ease } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16, ease } },
};

// ── Staggered lists ──────────────────────────────────────────────────
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.055, delayChildren: 0.03 },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.34, ease } },
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.16, ease } },
};

// ── Modals / sheets ──────────────────────────────────────────────────
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

export const sheetBottomVariants: Variants = {
  initial: { y: "100%" },
  animate: { y: 0, transition: T.sheet },
  exit: { y: "100%", transition: { duration: 0.24, ease } },
};

export const sheetRightVariants: Variants = {
  initial: { x: "100%" },
  animate: { x: 0, transition: T.sheet },
  exit: { x: "100%", transition: { duration: 0.24, ease } },
};

// ── Small elements (toast, popovers) ─────────────────────────────────
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.26, ease } },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.18, ease } },
};

// ── Chat bubbles ─────────────────────────────────────────────────────
export const bubbleVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease } },
};

// ── Gesture presets ──────────────────────────────────────────────────
export const tap = { scale: 0.97 } as const;
export const tapSmall = { scale: 0.93 } as const;
export const tapCard = { scale: 0.985 } as const;
