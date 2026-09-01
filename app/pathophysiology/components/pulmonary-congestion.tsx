import Image from "next/image";
import type { HemodynamicResults } from "./model";
import { clamp } from "./model";

export default function PulmonaryCongestion({ results }: { results: HemodynamicResults }) {
  const congestion = clamp((results.fillingPressure - 8) / 20, 0, 1);

  return (
    <section className="rounded-lg border border-[#d8bdb3] bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[.08em] text-[#75544c]">
            PULMONARY BACK-PRESSURE
          </p>
          <p className="mt-1 text-[9px] text-[#8d7770]">LV filling pressure → alveolar fluid</p>
        </div>
        <span className={`text-[9px] font-semibold ${congestion > 0.4 ? "text-secondary" : "text-primary"}`}>
          {congestion > 0.4 ? "CONGESTED" : "CLEAR"}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-[110px_1fr] items-center gap-3">
        <div className="relative h-24 w-[110px]">
          <Image
            src="/assets/medical/heart-failure/pulmonary-edema.png"
            alt="Alveolar anatomy demonstrating pulmonary edema"
            fill
            sizes="110px"
            className="object-contain transition-opacity duration-300"
            style={{ opacity: 0.26 + congestion * 0.74 }}
          />
        </div>
        <div>
          <p className="text-[9px] text-[#8d7770]">Estimated filling pressure</p>
          <p className="mt-1 font-accent text-lg font-bold text-[#4c2e29]">
            {results.fillingPressure.toFixed(0)} mmHg
          </p>
          <p className="mt-1 text-[9px] leading-4 text-[#806c66]">
            {congestion > 0.4
              ? "Hydrostatic pressure drives fluid into the interstitium and alveolar spaces."
              : "Pulmonary capillary pressure remains below the modeled congestion threshold."}
          </p>
        </div>
      </div>
    </section>
  );
}
