import type { SpaceData, SpaceId } from "@/state/types";
import type { IconName } from "@/components/ui/Icon";

export const spaceIcons: Record<SpaceId, IconName> = {
  casa: "house",
  coche: "car",
  mascotas: "paw",
  familia: "family",
};

export const mockSpaces: Record<SpaceId, SpaceData> = {
  casa: {
    id: "casa",
    name: "Casa",
    status: "Requiere atención",
    load: "ocupado",
    itemCount: 5,
    alertCount: 2,
    nextAction: "Revisar el seguro del hogar",
    blurb: "Factura de luz un 18% más alta y seguro próximo a vencer.",
    sectionTitles: [
      "Resumen",
      "Seguros",
      "Facturas",
      "Electrodomésticos",
      "Análisis",
    ],
    sections: [
      {
        title: "Resumen",
        rows: [
          { label: "Estado", value: "Requiere atención", severity: "warn" },
          { label: "Elementos registrados", value: "5" },
          { label: "Alertas activas", value: "2" },
        ],
      },
      {
        title: "Seguros",
        rows: [
          {
            label: "Seguro del hogar",
            value: "Vence 1 ago 2026",
            severity: "warn",
            mono: true,
          },
        ],
      },
      {
        title: "Facturas",
        rows: [
          {
            label: "Luz · bimestral",
            value: "+18% sobre la media",
            severity: "warn",
          },
          { label: "Agua · trimestral", value: "Estable" },
        ],
      },
      {
        title: "Electrodomésticos",
        rows: [
          { label: "Lavadora", value: "Nueva · garantía hasta 2027" },
          { label: "Microondas", value: "8 años", severity: "warn" },
        ],
      },
    ],
    insights: [
      "Su microondas tiene 8 años. Si empieza a fallar, probablemente no compense repararlo.",
      "Su factura de luz es un 18% más alta. Revise la potencia contratada y las franjas de consumo.",
    ],
    projects: [
      {
        id: "proj-salon",
        title: "Salón · madera clara",
        spaceId: "casa",
        summary: "Redecoración con mueble de madera clara y paleta neutra.",
        budget: "800 – 1.400 €",
        palette: ["#F1ECE3", "#D9C7A8", "#C9A87E", "#8C7A66", "#5C5247"],
      },
    ],
  },

  coche: {
    id: "coche",
    name: "Coche",
    status: "Requiere atención",
    load: "ocupado",
    itemCount: 5,
    alertCount: 1,
    nextAction: "Reservar cita para la ITV",
    blurb: "ITV pendiente este mes y seguro a revisar en octubre.",
    sectionTitles: [
      "Perfil del vehículo",
      "Seguro",
      "ITV",
      "Mantenimiento",
      "Gastos",
    ],
    sections: [
      {
        title: "Perfil del vehículo",
        rows: [
          { label: "Modelo", value: "Audi A3" },
          { label: "Año", value: "2020", mono: true },
          { label: "Combustible", value: "Gasolina" },
        ],
      },
      {
        title: "Seguro",
        rows: [
          { label: "Compañía", value: "Mapfre · terceros ampliado" },
          { label: "Prima anual", value: "692 €", mono: true },
          {
            label: "Vencimiento",
            value: "Octubre 2026",
            severity: "warn",
            mono: true,
          },
        ],
      },
      {
        title: "ITV",
        rows: [
          {
            label: "Estado",
            value: "Sin cita · vence este mes",
            severity: "danger",
          },
        ],
      },
      {
        title: "Mantenimiento",
        rows: [
          { label: "Último servicio", value: "Cambio de aceite" },
          { label: "Taller", value: "180 €", mono: true },
        ],
      },
    ],
    insights: [
      "Antes de la ITV revise neumáticos, luces y limpiaparabrisas.",
      "Su seguro vence en octubre. Compare el precio 30 días antes de la renovación.",
    ],
    projects: [
      {
        id: "proj-coche",
        title: "Modificación elegante",
        spaceId: "coche",
        summary:
          "Llantas en negro mate, logos en negro, cristales ligeramente tintados y detailing exterior.",
        budget: "600 – 1.200 €",
        palette: ["#0E0E0E", "#1A1A1A", "#2B2B2B", "#4A4A4A", "#6E6E6E"],
      },
    ],
  },

  mascotas: {
    id: "mascotas",
    name: "Mascotas",
    status: "Revisión próxima",
    load: "tranquilo",
    itemCount: 3,
    alertCount: 1,
    nextAction: "Confirmar la próxima vacuna",
    blurb: "Maltés de 8 años. Conviene revisar la próxima vacuna.",
    notice: "Esto no sustituye a un veterinario.",
    sectionTitles: [
      "Perfil",
      "Salud",
      "Vacunas",
      "Alimentación",
      "Veterinario",
    ],
    sections: [
      {
        title: "Perfil",
        rows: [
          { label: "Especie", value: "Perro · maltés" },
          { label: "Edad", value: "8 años", mono: true },
          { label: "Sexo", value: "Macho" },
        ],
      },
      {
        title: "Salud",
        rows: [{ label: "Estado general", value: "Bueno" }],
      },
      {
        title: "Vacunas",
        rows: [
          {
            label: "Última vacuna",
            value: "Verano 2025",
            severity: "warn",
            mono: true,
          },
          { label: "Próxima", value: "A revisar", severity: "warn" },
        ],
      },
      {
        title: "Alimentación",
        rows: [{ label: "Pienso", value: "Royal Canin · seco" }],
      },
      {
        title: "Veterinario",
        rows: [
          {
            label: "Revisión reservada",
            value: "19 jun · 10:00",
            mono: true,
          },
        ],
      },
    ],
    insights: [
      "A los 8 años conviene una revisión anual. Tiene una cita el 19 de junio.",
      "Su última vacuna consta de verano 2025. Confirme con el veterinario la pauta del próximo recordatorio.",
    ],
    projects: [],
  },

  familia: {
    id: "familia",
    name: "Familia",
    status: "Atención puntual",
    load: "tranquilo",
    itemCount: 3,
    alertCount: 1,
    nextAction: "Firmar la autorización escolar",
    blurb: "Cumpleaños de Marta el 24 y una autorización pendiente.",
    sectionTitles: [
      "Miembros",
      "Citas",
      "Cumpleaños",
      "Documentos",
      "Colegio y actividades",
    ],
    sections: [
      {
        title: "Miembros",
        rows: [
          { label: "Hugo", value: "Titular" },
          { label: "Marta", value: "Pareja" },
          { label: "Leo", value: "Hijo · 7 años" },
        ],
      },
      {
        title: "Citas",
        rows: [{ label: "Cita médica de Leo", value: "23 jun", mono: true }],
      },
      {
        title: "Cumpleaños",
        rows: [{ label: "Marta", value: "24 jun", mono: true }],
      },
      {
        title: "Documentos",
        rows: [
          {
            label: "Autorización escolar",
            value: "Pendiente de firma",
            severity: "warn",
          },
        ],
      },
      {
        title: "Colegio y actividades",
        rows: [{ label: "Natación de Leo", value: "Martes · 17:30" }],
      },
    ],
    insights: [
      "El cumpleaños de Marta es el 24 de junio. Aún tiene tiempo de preparar el regalo.",
      "La autorización escolar sigue pendiente de firma. No suele admitir prórroga.",
    ],
    projects: [],
  },
};

export const spaceOrder: SpaceId[] = ["casa", "coche", "mascotas", "familia"];
