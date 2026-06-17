import { ScreenScaffold } from "@/components/ScreenScaffold";
import { HomeGreeting } from "@/components/HomeGreeting";

export default function InicioPage() {
  return (
    <ScreenScaffold
      hero
      eyebrow="Inicio"
      titleNode={<HomeGreeting />}
      icon="home"
      intro="Su resumen del día, sin que tenga que buscarlo."
      points={[
        "Lo que requiere su atención hoy: vencimientos, recordatorios y avisos.",
        "Un único foco: como máximo, lo esencial. Nada de listas interminables.",
        "Acceso directo a hablar con LifeOS o capturar algo nuevo.",
      ]}
    />
  );
}
