import type { AttentionItem } from "@/state/types";

export const mockAttention: AttentionItem[] = [
  {
    id: "att-itv",
    severity: "danger",
    title: "ITV pendiente",
    module: "Coche",
    spaceId: "coche",
    description: "Vence este mes · sin cita reservada",
    actionLabel: "Gestionar",
  },
  {
    id: "att-hogar",
    severity: "warn",
    title: "Seguro del hogar",
    module: "Casa",
    spaceId: "casa",
    description: "Vence en 6 semanas · renovación automática activa",
    actionLabel: "Ver detalles",
  },
  {
    id: "att-mascota",
    severity: "warn",
    title: "Revisión del maltés",
    module: "Mascotas",
    spaceId: "mascotas",
    description: "Última vacuna en verano · conviene revisar la próxima",
    actionLabel: "Ver detalles",
  },
  {
    id: "att-luz",
    severity: "info",
    title: "Factura de luz un 18% más alta",
    module: "Casa",
    spaceId: "casa",
    description: "Revise la potencia contratada y las franjas de consumo",
    actionLabel: "Ver análisis",
  },
];
