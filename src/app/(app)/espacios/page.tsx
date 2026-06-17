import { ScreenScaffold } from "@/components/ScreenScaffold";

export default function EspaciosPage() {
  return (
    <ScreenScaffold
      eyebrow="Espacios"
      title="Espacios"
      icon="spaces"
      intro="Cada ámbito de su vida, organizado por LifeOS."
      points={[
        "Casa, Coche, Mascotas y Familia, cada uno con su propio detalle.",
        "Seguros, facturas, mantenimiento y documentos, donde corresponden.",
        "Recomendaciones útiles según lo que vaya capturando.",
      ]}
    />
  );
}
