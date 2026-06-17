import { Icon, type IconName } from "@/components/ui/Icon";
import { Pill, SectionLabel } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";

const tiles: { label: string; hint: string; icon: IconName }[] = [
  { label: "Voz", hint: "Cuéntelo en voz alta", icon: "mic" },
  { label: "Documento", hint: "Suba un PDF o factura", icon: "document" },
  { label: "Foto", hint: "Hágale una foto", icon: "camera" },
  { label: "Preguntar", hint: "Hable con LifeOS", icon: "chat" },
];

export default function CapturarPage() {
  return (
    <div className="px-5 pb-6 pt-6">
      <header>
        <SectionLabel>Capturar</SectionLabel>
        <h1 className="mt-1 font-display text-2xl text-ink">Capturar</h1>
        <p className="mt-2 max-w-[20rem] text-md leading-relaxed text-ink-2">
          No rellene nada. Háblelo, súbalo o hágale una foto. LifeOS lo
          entiende.
        </p>
      </header>

      <Stagger className="mt-7 grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <StaggerItem key={t.label} className="flex">
            <div className="relative flex w-full flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-5">
              <span className="absolute right-3 top-3">
                <Pill>Pronto</Pill>
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] text-accent">
                <Icon name={t.icon} size={24} />
              </span>
              <span>
                <span className="block text-md font-medium text-ink">
                  {t.label}
                </span>
                <span className="block text-sm text-ink-3">{t.hint}</span>
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-ink-3">
        LifeOS extraerá lo importante. Por defecto no guardaremos los documentos
        originales. La captura por voz y el análisis con IA llegan en las
        próximas fases.
      </p>
    </div>
  );
}
