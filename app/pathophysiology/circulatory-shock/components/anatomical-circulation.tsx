import type { CSSProperties } from "react";
import Image from "next/image";
import InteractiveCirculationSvg from "./interactive-circulation-svg";
import type { ShockModel, ShockResults } from "./model";
import { clamp, getDominantShock } from "./model";

type Props = {
  model: ShockModel;
  results: ShockResults;
};

export default function AnatomicalCirculation({ model, results }: Props) {
  const perfusion = clamp(results.perfusion / 100, 0.12, 1);
  const volume = clamp(1 - model.volumeLoss / 110, 0.2, 1);
  const tone = clamp(1 - model.vasodilation / 120, 0.25, 1);
  const pump = clamp(1 - model.pumpFailure / 108, 0.12, 1);

  return (
    <div className="grid min-h-[620px] gap-4 bg-[#f5f2ef] p-4 text-foreground lg:grid-cols-[minmax(0,1fr)_190px]">
      <figure className="mx-auto flex h-[620px] w-full max-w-[520px] flex-col overflow-hidden">
        <div className="relative min-h-0 flex-1">
          <InteractiveCirculationSvg model={model} results={results} />
        </div>
        <CirculationSequence cardiacOutput={results.cardiacOutput} />
      </figure>

      <aside className="flex flex-col gap-3 border-t border-[#ddd5cf] pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
        <div>
          <p className="text-[10px] font-semibold tracking-[.1em] text-primary">
            ACTIVE PATTERN
          </p>
          <p className="mt-1 text-base font-semibold">{getDominantShock(model)}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          <Indicator
            label="Circulating volume"
            value={volume}
            display={`${(volume * 100).toFixed(0)}%`}
          />
          <Indicator
            label="Pump performance"
            value={pump}
            display={`${(pump * 100).toFixed(0)}%`}
          />
          <Indicator
            label="Organ perfusion"
            value={perfusion}
            display={`${results.perfusion.toFixed(0)}%`}
          />
          <Indicator
            label="Vascular tone"
            value={tone}
            display={`${(tone * 100).toFixed(0)}%`}
          />
        </div>

        <div className="mt-auto rounded-lg border border-[#ddd5cf] bg-white/80 p-3">
          <p className="text-[10px] font-semibold text-muted">FLOW KEY</p>
          <div className="mt-3 space-y-2 text-[11px] text-muted">
            <p className="flex items-center gap-2">
              <span className="h-1 w-7 rounded-full bg-[#e63d42]" />
              Oxygenated systemic flow
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1 w-7 rounded-full bg-[#4562b3]" />
              Venous and pulmonary arterial flow
            </p>
            <p className="flex items-center gap-2">
              <span className="size-3 rounded-full border-2 border-secondary" />
              Mechanical obstruction
            </p>
            <p className="flex items-center gap-2">
              <Image
                src="/assets/medical/blood-cells/red-blood-cell-nih.svg"
                alt=""
                width={20}
                height={20}
                className="size-5 object-contain"
              />
              Red blood cell · O₂ transport
            </p>
            <p className="flex items-center gap-2">
              <Image
                src="/assets/medical/blood-cells/white-blood-cell-nih.png"
                alt=""
                width={20}
                height={20}
                className="size-5 object-contain"
              />
              White blood cell · immune defense
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function CirculationSequence({ cardiacOutput }: { cardiacOutput: number }) {
  const speed = `${clamp(7 / (cardiacOutput / 5.2), 5.5, 12)}s`;
  const steps = [
    ["Systemic veins", "Deoxygenated"],
    ["Right heart", "Pulmonary output"],
    ["Lungs", "Gas exchange"],
    ["Left heart", "Systemic output"],
    ["Body organs", "O₂ delivery"],
  ];

  return (
    <div className="border-t border-[#ddd5cf] bg-white/70 px-3 py-3">
      <p className="mb-2 text-[9px] font-semibold tracking-[.1em] text-muted">
        DIRECTION OF BLOOD FLOW
      </p>
      <div className="flex items-stretch" style={{ "--flow-cycle": speed } as CSSProperties}>
        {steps.map(([title, subtitle], index) => (
          <div key={title} className="flex min-w-0 flex-1 items-center">
            <div
              className="flow-sequence-step min-w-0 flex-1 rounded-md border border-[#ddd5cf] bg-white px-1.5 py-2 text-center"
              style={{ animationDelay: `${index * 1.1}s` }}
            >
              <strong className="block truncate text-[9px]">{title}</strong>
              <span className="mt-0.5 block truncate text-[7px] text-muted">{subtitle}</span>
            </div>
            {index < steps.length - 1 && (
              <span className="px-1 text-xs font-bold text-primary" aria-hidden="true">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Indicator({
  label,
  value,
  display,
}: {
  label: string;
  value: number;
  display: string;
}) {
  return (
    <div className="rounded-lg border border-[#ddd5cf] bg-white/80 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] text-muted">{label}</p>
        <strong className="font-accent text-xs">{display}</strong>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e5ded8]">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${value < 0.55 ? "bg-secondary" : "bg-primary"}`}
          style={{ width: `${clamp(value * 100, 3, 100)}%` }}
        />
      </div>
    </div>
  );
}
