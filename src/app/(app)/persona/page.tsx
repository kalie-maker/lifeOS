import { ScreenScaffold } from "@/components/ScreenScaffold";

export default function PersonaPage() {
  return (
    <ScreenScaffold
      eyebrow="Persona"
      title="Persona"
      icon="user"
      intro="Quién es usted esta semana y cómo se encuentra."
      points={[
        "Descanso, ánimo, energía y actividad, registrados sin esfuerzo.",
        "Patrones cruzados: cómo se relacionan su sueño, su ánimo y su entreno.",
        "Un registro rápido de cómo se encuentra hoy.",
      ]}
    />
  );
}
