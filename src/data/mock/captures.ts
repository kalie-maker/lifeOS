import type { IconName } from "@/components/ui/Icon";
import type { SpaceId } from "@/state/types";

// ── Voice flow ──────────────────────────────────────────────────────
export const voiceTranscript =
  "Tengo un Audi A3 de 2020, el seguro me vence en octubre, no sé cuándo " +
  "toca la ITV. También tengo un perro maltés de 8 años, come Royal Canin " +
  "y la última vacuna fue en verano. En casa tenemos una lavadora nueva, " +
  "un microondas de 8 años y el seguro del hogar creo que vence en marzo.";

export type LineTag = "ok" | "warn" | "info" | "pending";

export interface VoiceModuleResult {
  module: string;
  icon: IconName;
  spaceId?: SpaceId;
  lines: { text: string; tag?: LineTag }[];
}

export const voiceResults: VoiceModuleResult[] = [
  {
    module: "Coche",
    icon: "car",
    spaceId: "coche",
    lines: [
      { text: "Audi A3 2020 registrado", tag: "ok" },
      { text: "Seguro: vence octubre 2026 — recordatorio creado", tag: "info" },
      { text: "ITV: sin fecha — acción recomendada", tag: "warn" },
    ],
  },
  {
    module: "Mascotas",
    icon: "paw",
    spaceId: "mascotas",
    lines: [
      { text: "Maltés · 8 años · Royal Canin", tag: "ok" },
      { text: "Última vacuna: verano 2025 — revisar próxima", tag: "warn" },
    ],
  },
  {
    module: "Casa",
    icon: "house",
    spaceId: "casa",
    lines: [
      { text: "Lavadora nueva registrada", tag: "ok" },
      { text: "Microondas: 8 años — insight añadido", tag: "info" },
      { text: "Seguro hogar: vence marzo — recordatorio creado", tag: "info" },
    ],
  },
  {
    module: "Pendientes",
    icon: "search",
    lines: [
      { text: "¿Matrícula del coche para la ITV?", tag: "pending" },
      { text: "¿Nombre del perro?", tag: "pending" },
    ],
  },
];

// ── Photo flow ──────────────────────────────────────────────────────
export interface PhotoScenario {
  id: "salon" | "coche" | "microondas";
  title: string;
  icon: IconName;
  spaceId: SpaceId;
  question: string;
  prompt: string;
  analysis: string[];
  notice?: string;
  budget: string;
  palette: string[];
  primaryAction: string;
  secondaryAction?: string;
  createsProject: boolean;
}

export const photoScenarios: PhotoScenario[] = [
  {
    id: "salon",
    title: "Salón",
    icon: "house",
    spaceId: "casa",
    question: "¿Qué quiere hacer con esta imagen?",
    prompt: "Quiero ideas para redecorar con mueble de madera clara.",
    analysis: [
      "Espacio de unos 22 m² con buena luz natural.",
      "Estilo actual: neutro, algo recargado en la pared principal.",
      "Paleta recomendada: madera clara, lino y un acento azul profundo.",
      "Sugerencia: liberar la pared y unificar textiles.",
    ],
    budget: "800 – 1.400 € (orientativo)",
    palette: ["#F1ECE3", "#D9C7A8", "#C9A87E", "#8C7A66", "#1B3A6B"],
    primaryAction: "Guardar proyecto «Salón»",
    secondaryAction: "Buscar inspiración",
    createsProject: true,
  },
  {
    id: "coche",
    title: "Coche",
    icon: "car",
    spaceId: "coche",
    question: "¿Qué quiere hacer con esta imagen?",
    prompt: "Hazme una propuesta de modificación elegante.",
    analysis: [
      "Llantas en negro mate en lugar del acabado actual.",
      "Logos en negro y cristales ligeramente tintados.",
      "Detailing exterior y retoques sutiles en el interior.",
      "Conjunto sobrio, sin estridencias.",
    ],
    notice:
      "Revise la normativa de homologación local antes de tintar los cristales.",
    budget: "600 – 1.200 € (orientativo)",
    palette: ["#0E0E0E", "#1A1A1A", "#2B2B2B", "#4A4A4A", "#6E6E6E"],
    primaryAction: "Guardar proyecto «Modificación»",
    secondaryAction: "Buscar inspiración",
    createsProject: true,
  },
  {
    id: "microondas",
    title: "Microondas",
    icon: "house",
    spaceId: "casa",
    question: "¿Qué quiere hacer con esta imagen?",
    prompt: "¿Me compensa cambiarlo?",
    analysis: [
      "Vida útil media de un microondas: 8 – 10 años.",
      "El suyo tiene 8 años: está al final de su vida esperada.",
      "Antes de decidir, revise que funcione bien, esté limpio y la puerta cierre con firmeza.",
      "Reparar suele compensar solo si el fallo es menor.",
    ],
    budget: "120 – 280 € un modelo nuevo (orientativo)",
    palette: ["#E8E4DE", "#C9C3BA", "#A09B96", "#6B6560", "#1A1814"],
    primaryAction: "Guardar en el Espacio Casa",
    createsProject: false,
  },
];
