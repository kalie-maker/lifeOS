import type { IconName } from "@/components/ui/Icon";
import type { CaptureEntity, SpaceKey } from "./entities";
import type { OnboardingData } from "./onboarding";

// ------------------------------------------------------------------
//  The four LifeOS spaces. Maps the Spanish route slug to the entity
//  `space` key and carries the presentational metadata.
// ------------------------------------------------------------------

export interface SpaceMeta {
  slug: string; // route segment: /espacios/<slug>
  key: SpaceKey; // entity.space value
  label: string;
  icon: IconName;
  blurb: string; // short tagline (grid card + detail subtitle)
  emptyLine: string; // empty-state headline
}

export const SPACES: SpaceMeta[] = [
  {
    slug: "casa",
    key: "home",
    label: "Casa",
    icon: "house",
    blurb: "Hogar, facturas, seguros y electrodomésticos.",
    emptyLine: "Aún no hay nada registrado en Casa.",
  },
  {
    slug: "coche",
    key: "car",
    label: "Coche",
    icon: "car",
    blurb: "Vehículo, ITV, seguro y mantenimiento.",
    emptyLine: "Aún no hay nada registrado en Coche.",
  },
  {
    slug: "mascotas",
    key: "pet",
    label: "Mascotas",
    icon: "paw",
    blurb: "Salud, vacunas, alimentación y veterinario.",
    emptyLine: "Aún no hay nada registrado en Mascotas.",
  },
  {
    slug: "familia",
    key: "family",
    label: "Familia",
    icon: "family",
    blurb: "Miembros, citas, cumpleaños y colegio.",
    emptyLine: "Aún no hay nada registrado en Familia.",
  },
];

export function spaceBySlug(slug: string): SpaceMeta | undefined {
  return SPACES.find((s) => s.slug === slug);
}

/**
 * Synthetic entities derived from the onboarding answers, so a space isn't
 * empty just because the user hasn't captured anything yet. These are
 * display-only (no id, not stored) and render before any captured entity.
 */
export function onboardingEntities(
  key: SpaceKey,
  data: OnboardingData | null,
): CaptureEntity[] {
  if (!data) return [];
  const out: CaptureEntity[] = [];

  const asset = (title: string, description: string): CaptureEntity => ({
    type: "asset",
    space: key,
    title,
    description,
    date: null,
    expiry_date: null,
    tags: ["onboarding"],
  });

  if (key === "car") {
    if (data.assets.includes("coche"))
      out.push(asset("Vehículo registrado", "Lo indicó durante la configuración inicial."));
    if (data.assets.includes("moto"))
      out.push(asset("Moto registrada", "La indicó durante la configuración inicial."));
  }

  if (key === "pet") {
    if (data.assets.includes("perro"))
      out.push(asset("Perro registrado", "Lo indicó durante la configuración inicial."));
    if (data.assets.includes("gato"))
      out.push(asset("Gato registrado", "Lo indicó durante la configuración inicial."));
    if (data.assets.includes("otra"))
      out.push(asset("Mascota registrada", "La indicó durante la configuración inicial."));
  }

  if (key === "family") {
    if (data.livingStatus === "familia") {
      const count = data.familyCount ? ` · ${data.familyCount} personas` : "";
      out.push({
        type: "note",
        space: key,
        title: "Su familia",
        description: `Convive con su familia${count}.`,
        date: null,
        expiry_date: null,
        tags: ["onboarding"],
      });
    } else if (data.livingStatus === "pareja") {
      out.push({
        type: "note",
        space: key,
        title: "Convivencia en pareja",
        description: "Lo indicó durante la configuración inicial.",
        date: null,
        expiry_date: null,
        tags: ["onboarding"],
      });
    }
  }

  return out;
}
