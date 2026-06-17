import { ScreenScaffold } from "@/components/ScreenScaffold";

export default function CalendarioPage() {
  return (
    <ScreenScaffold
      eyebrow="Calendario"
      title="Calendario"
      icon="calendar"
      intro="Su calendario vital, no una agenda más."
      points={[
        "Eventos, vencimientos y cumpleaños, reunidos en un solo lugar.",
        "El color de cada día indica su carga: tranquilo, ocupado o saturado.",
        "Al pulsar un día, LifeOS le dirá qué tiene y qué conviene posponer.",
      ]}
    />
  );
}
