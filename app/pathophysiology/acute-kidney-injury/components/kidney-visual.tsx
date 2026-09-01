import Image from "next/image";
import type { CSSProperties } from "react";
import type { AkiModel, AkiResults } from "./model";
import { clamp, getDominantMechanism } from "./model";

type Props = {
  model: AkiModel;
  results: AkiResults;
  stage: string;
  status: string;
};

export default function KidneyVisual({ model, results, stage, status }: Props) {
  const perfusion = clamp(1 - model.perfusionLoss / 115, 0.18, 1);
  const tubularInjury = model.tubularDamage / 100;
  const obstruction = model.obstruction / 100;
  const dominant = getDominantMechanism(model);
  const kidneyStyle = {
    filter: `saturate(${0.45 + perfusion * 0.65}) brightness(${0.72 + perfusion * 0.28})`,
  } as CSSProperties;

  return (
    <div className="relative flex min-h-[680px] flex-col overflow-hidden border-b border-white/15 xl:border-b-0 xl:border-r">
      <div className="medical-grid absolute inset-0 opacity-20" />
      <div className="relative z-20 flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] text-white/40">CURRENT RENAL STATE</p>
          <h2 className="mt-1 text-xl font-semibold">{status}</h2>
          <p className="mt-1 text-xs text-white/45">{dominant}</p>
        </div>
        <span className="rounded-md border border-white/15 px-3 py-2 font-accent text-xs text-[#a4d9d0]" aria-live="polite">
          {stage}
        </span>
      </div>

      <div className="relative z-10 grid flex-1 gap-3 px-4 pb-4 lg:grid-cols-[1.02fr_.98fr]">
        <div className="relative min-h-[515px] overflow-hidden rounded-lg border border-white/10 bg-[#f5ece8] p-3 text-[#4c2e29]">
          <div className="flex justify-between gap-2 text-[10px] font-semibold text-[#75544c]">
            <span>ANATOMICAL RESPONSE</span>
            <span>Perfusion · nephron · outflow</span>
          </div>

          <div className="absolute left-[4%] top-[10%] h-[52%] w-[54%]">
            <Image
              src="/assets/medical/acute-kidney-injury/kidney-cross-section.png"
              alt="Cross-section of the kidney showing renal vessels, cortex, medulla, and collecting system"
              fill
              priority
              sizes="330px"
              className="object-contain drop-shadow-[0_16px_20px_rgba(83,34,28,.18)] transition-[filter] duration-300"
              style={kidneyStyle}
            />
            <span
              className="kidney-flow absolute left-[12%] top-[43%] h-2 rounded-full bg-[#d7473e] shadow-[0_0_12px_rgba(215,71,62,.8)] transition-all duration-300"
              style={{ width: `${12 + perfusion * 25}%`, opacity: 0.35 + perfusion * 0.65 }}
            />
          </div>

          <div className="absolute right-[3%] top-[9%] w-[40%] rounded-lg border border-[#d8bdb3] bg-white/92 p-2 shadow-sm">
            <div className="flex justify-between gap-2">
              <p className="text-[9px] font-semibold text-[#75544c]">NEPHRON</p>
              <span className={`text-[8px] font-semibold ${tubularInjury > 0.45 ? "text-secondary" : "text-primary"}`}>
                {tubularInjury > 0.45 ? "TUBULAR INJURY" : "PRESERVED"}
              </span>
            </div>
            <div className="relative mx-auto mt-1 h-48 w-full">
              <Image
                src="/assets/medical/acute-kidney-injury/nephron.png"
                alt="Nephron with glomerulus and renal tubules"
                fill
                sizes="220px"
                className="object-contain transition-[filter] duration-300"
                style={{ filter: `sepia(${tubularInjury * 0.55}) saturate(${1 + tubularInjury})` }}
              />
              <span
                className="absolute inset-x-[27%] top-[23%] h-[58%] rounded-full bg-secondary/25 blur-md transition-opacity duration-300"
                style={{ opacity: tubularInjury }}
              />
            </div>
            <p className="text-[9px] leading-4 text-[#806c66]">
              Tubular injury reduces sodium reabsorption and concentrating function.
            </p>
          </div>

          <div className="absolute bottom-[4%] left-[3%] w-[45%] rounded-lg border border-[#d8bdb3] bg-white/92 p-2 shadow-sm">
            <div className="flex justify-between gap-2">
              <p className="text-[9px] font-semibold text-[#75544c]">OUTFLOW</p>
              <span className={`text-[8px] font-semibold ${obstruction > 0.45 ? "text-secondary" : "text-primary"}`}>
                {obstruction > 0.45 ? "OBSTRUCTED" : "PATENT"}
              </span>
            </div>
            <div className="relative mx-auto mt-1 h-40 w-full">
              <Image
                src="/assets/medical/acute-kidney-injury/urinary-tract.png"
                alt="Urinary tract showing kidneys, ureters, and bladder"
                fill
                sizes="230px"
                className="object-contain"
              />
              <span
                className="absolute bottom-[19%] left-1/2 size-7 -translate-x-1/2 rounded-full border-4 border-secondary bg-secondary/35 shadow-[0_0_16px_rgba(216,120,61,.7)] transition-opacity duration-300"
                style={{ opacity: obstruction }}
              />
            </div>
          </div>

          <div className="absolute bottom-[4%] right-[3%] w-[45%] rounded-lg border border-[#d8bdb3] bg-white/92 p-2 shadow-sm">
            <div className="flex justify-between gap-2">
              <p className="text-[9px] font-semibold text-[#75544c]">TISSUE INJURY</p>
              <span className={`text-[8px] font-semibold ${tubularInjury > 0.45 ? "text-secondary" : "text-primary"}`}>
                {tubularInjury > 0.45 ? "ACTIVE" : "MINIMAL"}
              </span>
            </div>
            <div className="relative mx-auto mt-1 h-40 w-full">
              <Image
                src="/assets/medical/acute-kidney-injury/kidney-injury.png"
                alt="Medical illustration of kidney tissue injury"
                fill
                sizes="230px"
                className="object-contain transition-opacity duration-300"
                style={{ opacity: 0.18 + tubularInjury * 0.82 }}
              />
            </div>
          </div>

          <div className="absolute bottom-[38%] left-[7%] rounded-md border border-[#d8bdb3] bg-white/92 px-3 py-2">
            <p className="text-[8px] text-[#806c66]">RENAL PERFUSION</p>
            <strong className="font-accent text-sm">{(perfusion * 100).toFixed(0)}%</strong>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/10 p-4">
          <div className="flex justify-between gap-3">
            <p className="text-[10px] font-semibold text-white/45">FILTRATION & RETENTION</p>
            <span className="text-[10px] text-white/35">Current / reference</span>
          </div>
          <div className="mt-8 grid gap-6">
            <MetricBar label="GLOMERULAR FILTRATION" value={results.gfr} max={120} display={`${results.gfr.toFixed(0)} mL/min`} reverse />
            <MetricBar label="SERUM CREATININE" value={results.creatinine} max={6} display={`${results.creatinine.toFixed(2)} mg/dL`} />
            <MetricBar label="BLOOD UREA NITROGEN" value={results.bun} max={80} display={`${results.bun.toFixed(0)} mg/dL`} />
            <MetricBar label="URINE OUTPUT" value={results.urineOutput} max={1.2} display={`${results.urineOutput.toFixed(2)} mL/kg/h`} reverse />
          </div>

          <div className="mt-9 rounded-lg border border-white/10 bg-[#0d302d] p-4">
            <p className="text-[10px] text-white/40">FILTER → REABSORB → EXCRETE</p>
            <div className="mt-5 flex items-center gap-2" aria-label="Renal processing pathway">
              {["Blood", "Glomerulus", "Tubule", "Urine"].map((label, index) => (
                <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
                  <div className={`min-w-0 flex-1 rounded-md border px-2 py-3 text-center text-[9px] font-semibold ${index === 2 && tubularInjury > 0.45 ? "border-secondary bg-secondary/15 text-[#efad84]" : index === 3 && obstruction > 0.45 ? "border-secondary bg-secondary/15 text-[#efad84]" : "border-white/15 text-white/60"}`}>
                    {label}
                  </div>
                  {index < 3 && <span className="text-white/25">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap justify-between gap-3 border-t border-white/10 px-5 py-3 text-[11px] text-white/45">
        <span>Organ anatomy, nephron function, and laboratory values respond together.</span>
        <span>Illustrations adapted from Servier Medical Art · CC BY 4.0</span>
      </div>
    </div>
  );
}

function MetricBar({
  label,
  value,
  max,
  display,
  reverse = false,
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  reverse?: boolean;
}) {
  const width = clamp((value / max) * 100, 3, 100);
  const concerning = reverse ? value / max < 0.5 : value / max > 0.45;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[10px] text-white/45">{label}</p>
        <strong className="font-accent text-sm tabular-nums">{display}</strong>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${concerning ? "bg-secondary" : "bg-[#8fd0c4]"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
