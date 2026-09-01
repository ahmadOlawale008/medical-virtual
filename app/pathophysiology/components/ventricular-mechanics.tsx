import Image from "next/image";
import type { HeartFailureModel, HemodynamicResults } from "./model";
import { clamp } from "./model";

export default function VentricularMechanics({
  model,
  results,
}: {
  model: HeartFailureModel;
  results: HemodynamicResults;
}) {
  const dilation = clamp((results.endDiastolicVolume - 110) / 95, 0, 1);
  const residualFraction = clamp(results.endSystolicVolume / results.endDiastolicVolume, 0, 1);

  return (
    <section className="rounded-lg border border-[#d8bdb3] bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[.08em] text-[#75544c]">
            VENTRICULAR MECHANICS
          </p>
          <p className="mt-1 text-[9px] text-[#8d7770]">End-diastole → end-systole</p>
        </div>
        <span className={`text-[9px] font-semibold ${dilation > 0.35 ? "text-secondary" : "text-primary"}`}>
          {dilation > 0.35 ? "DILATED" : "REFERENCE"}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-[108px_1fr] items-center gap-3">
        <div className="relative h-24 w-[108px]">
          <Image
            src="/assets/medical/heart-failure/heart-cross-section.png"
            alt="Short-axis ventricular cross-section"
            fill
            sizes="108px"
            className="object-contain transition-transform duration-300"
            style={{ transform: `scale(${0.88 + dilation * 0.16})` }}
          />
          <span
            className="absolute left-[52%] top-[49%] block -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-secondary/70 bg-secondary/15 transition-[width,height] duration-300"
            style={{ width: `${24 + residualFraction * 38}px`, height: `${27 + residualFraction * 42}px` }}
          />
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-[9px]">
          <Metric label="EDV" value={`${results.endDiastolicVolume.toFixed(0)} mL`} />
          <Metric label="ESV" value={`${results.endSystolicVolume.toFixed(0)} mL`} />
          <Metric label="Stroke volume" value={`${results.strokeVolume.toFixed(0)} mL`} />
          <Metric label="Contractility" value={`${model.contractility}%`} />
        </dl>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eadbd6]">
        <div
          className="h-full bg-secondary transition-[width] duration-300"
          style={{ width: `${Math.max(6, residualFraction * 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[9px] leading-4 text-[#806c66]">
        Residual LV volume after systole: {(residualFraction * 100).toFixed(0)}% of EDV.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[#8d7770]">{label}</dt>
      <dd className="mt-0.5 font-accent text-xs font-bold text-[#4c2e29]">{value}</dd>
    </div>
  );
}
