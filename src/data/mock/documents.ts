import type { IconName } from "@/components/ui/Icon";
import type { AnalyzedDoc, SpaceId } from "@/state/types";

export interface MockDocument {
  id: string;
  name: string;
  meta: string;
  icon: IconName;
  module: string;
  spaceId?: SpaceId;
  taxNotice?: boolean;
  /** if present, confirming creates this calendar reminder */
  reminder?: { date: string; title: string };
  analysis: {
    type: string;
    fields: { label: string; value: string; mono?: boolean }[];
    review: string[];
    actions: string[];
  };
  /** default selection of what to keep */
  keepOptions: { id: string; label: string; default: boolean }[];
}

export const mockDocuments: MockDocument[] = [
  {
    id: "doc-seguro-coche",
    name: "Seguro coche.pdf",
    meta: "Mapfre · 692 € · oct 2026 · terceros ampliado",
    icon: "car",
    module: "Coche",
    spaceId: "coche",
    reminder: {
      date: "2026-10-01",
      title: "Recordatorio: renovación del seguro del coche",
    },
    analysis: {
      type: "Póliza de seguro de vehículo",
      fields: [
        { label: "Compañía", value: "Mapfre" },
        { label: "Tipo", value: "Terceros ampliado" },
        { label: "Precio anual", value: "692 €", mono: true },
        { label: "Vencimiento", value: "Octubre 2026", mono: true },
      ],
      review: [
        "Cobertura de lunas no incluida.",
        "Renovación automática activa — confirme si desea continuar.",
        "Precio elevado — compare 30 días antes del vencimiento.",
      ],
      actions: [
        "Guardar la fecha de vencimiento en el Calendario.",
        "Crear recordatorio: 1 de octubre de 2026.",
        "Añadir el resumen al Espacio Coche.",
      ],
    },
    keepOptions: [
      { id: "fecha", label: "Fecha importante", default: true },
      { id: "importe", label: "Importe (692 €)", default: true },
      { id: "resumen", label: "Resumen del análisis", default: true },
      { id: "recordatorio", label: "Recordatorio en Calendario", default: true },
      { id: "accion", label: "Acción recomendada", default: true },
      { id: "original", label: "Documento original", default: false },
    ],
  },
  {
    id: "doc-factura-luz",
    name: "Factura luz.pdf",
    meta: "+18% sobre la media · bimestral",
    icon: "house",
    module: "Casa",
    spaceId: "casa",
    analysis: {
      type: "Factura de electricidad",
      fields: [
        { label: "Periodo", value: "Bimestral" },
        { label: "Variación", value: "+18% sobre la media", mono: true },
        { label: "Potencia contratada", value: "5,75 kW", mono: true },
      ],
      review: [
        "Consumo superior a su media habitual.",
        "Parte del gasto cae en franja punta.",
        "Posible potencia contratada por encima de lo necesario.",
      ],
      actions: [
        "Revisar la potencia contratada.",
        "Desplazar consumos a franja valle.",
        "Añadir insight al Espacio Casa.",
      ],
    },
    keepOptions: [
      { id: "importe", label: "Variación de consumo", default: true },
      { id: "resumen", label: "Resumen del análisis", default: true },
      { id: "accion", label: "Acción recomendada", default: true },
      { id: "original", label: "Documento original", default: false },
    ],
  },
  {
    id: "doc-seguro-hogar",
    name: "Seguro hogar.pdf",
    meta: "Vence agosto 2026",
    icon: "house",
    module: "Casa",
    spaceId: "casa",
    reminder: {
      date: "2026-07-02",
      title: "Recordatorio: renovación del seguro del hogar",
    },
    analysis: {
      type: "Póliza de seguro de hogar",
      fields: [
        { label: "Cobertura", value: "Continente y contenido" },
        { label: "Vencimiento", value: "1 ago 2026", mono: true },
        { label: "Renovación", value: "Automática" },
      ],
      review: [
        "Renovación automática activa.",
        "Revise el capital asegurado del contenido.",
      ],
      actions: [
        "Guardar la fecha de vencimiento en el Calendario.",
        "Crear recordatorio 30 días antes.",
      ],
    },
    keepOptions: [
      { id: "fecha", label: "Fecha importante", default: true },
      { id: "resumen", label: "Resumen del análisis", default: true },
      { id: "recordatorio", label: "Recordatorio en Calendario", default: true },
      { id: "original", label: "Documento original", default: false },
    ],
  },
  {
    id: "doc-garantia-lavadora",
    name: "Garantía lavadora.pdf",
    meta: "2 años · hasta 2027",
    icon: "house",
    module: "Casa",
    spaceId: "casa",
    analysis: {
      type: "Garantía de electrodoméstico",
      fields: [
        { label: "Producto", value: "Lavadora" },
        { label: "Duración", value: "2 años" },
        { label: "Cobertura hasta", value: "2027", mono: true },
      ],
      review: [
        "Conserve el justificante de compra.",
        "La garantía cubre defectos de fabricación, no mal uso.",
      ],
      actions: [
        "Registrar el electrodoméstico en el Espacio Casa.",
        "Guardar la fecha de fin de garantía.",
      ],
    },
    keepOptions: [
      { id: "fecha", label: "Fin de garantía (2027)", default: true },
      { id: "resumen", label: "Resumen del análisis", default: true },
      { id: "original", label: "Documento original", default: false },
    ],
  },
  {
    id: "doc-factura-taller",
    name: "Factura taller.pdf",
    meta: "180 € · cambio de aceite",
    icon: "car",
    module: "Coche",
    spaceId: "coche",
    analysis: {
      type: "Factura de taller",
      fields: [
        { label: "Servicio", value: "Cambio de aceite y filtro" },
        { label: "Importe", value: "180 €", mono: true },
        { label: "Fecha", value: "Junio 2026", mono: true },
      ],
      review: [
        "Precio dentro de mercado para el servicio realizado.",
        "Anote el kilometraje para el próximo cambio.",
      ],
      actions: [
        "Registrar el gasto en el Espacio Coche.",
        "Programar el próximo cambio de aceite.",
      ],
    },
    keepOptions: [
      { id: "importe", label: "Importe (180 €)", default: true },
      { id: "resumen", label: "Resumen del análisis", default: true },
      { id: "original", label: "Documento original", default: false },
    ],
  },
  {
    id: "doc-renta",
    name: "Declaración renta.pdf",
    meta: "Orientativo — requiere profesional",
    icon: "document",
    module: "Familia",
    spaceId: "familia",
    taxNotice: true,
    analysis: {
      type: "Borrador de declaración de la renta",
      fields: [
        { label: "Ejercicio", value: "2025" },
        { label: "Resultado estimado", value: "A devolver", mono: true },
      ],
      review: [
        "Revise las deducciones autonómicas aplicables.",
        "Confirme los datos de vivienda y rendimientos.",
      ],
      actions: [
        "Guardar un resumen orientativo.",
        "Consultar con un profesional antes de presentar.",
      ],
    },
    keepOptions: [
      { id: "resumen", label: "Resumen orientativo", default: true },
      { id: "original", label: "Documento original", default: false },
    ],
  },
];

// Documents already processed — seeds the "Biblioteca de análisis".
export const mockLibrary: AnalyzedDoc[] = [
  {
    id: "lib-seguro-hogar",
    name: "Seguro hogar.pdf",
    type: "Póliza de seguro de hogar",
    module: "Casa",
    date: "10 jun 2026",
    summary: "Continente y contenido. Vence 1 ago 2026. Renovación automática.",
    saved: ["Fecha importante", "Resumen", "Recordatorio"],
    originalKept: false,
    reminderCreated: true,
  },
  {
    id: "lib-factura-taller",
    name: "Factura taller.pdf",
    type: "Factura de taller",
    module: "Coche",
    date: "8 jun 2026",
    summary: "Cambio de aceite y filtro. 180 €.",
    saved: ["Importe", "Resumen"],
    originalKept: false,
    reminderCreated: false,
  },
  {
    id: "lib-garantia",
    name: "Garantía lavadora.pdf",
    type: "Garantía de electrodoméstico",
    module: "Casa",
    date: "2 jun 2026",
    summary: "Lavadora nueva. Garantía hasta 2027.",
    saved: ["Resumen"],
    originalKept: false,
    reminderCreated: false,
    needsReview: true,
  },
];
