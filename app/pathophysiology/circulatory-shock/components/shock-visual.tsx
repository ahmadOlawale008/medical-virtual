import AnatomicalCirculation from "./anatomical-circulation";
import type { ShockModel, ShockResults } from "./model";
import { getDominantShock } from "./model";

type Props = {
  model: ShockModel;
  results: ShockResults;
  stage: string;
  status: string;
};

export default function ShockVisual({ model, results, stage, status }: Props) {
  return (
    <div className="relative flex min-h-[680px] flex-col overflow-hidden border-b border-white/15 xl:border-b-0 xl:border-r">
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] text-white/40">CURRENT CIRCULATORY STATE</p>
          <h2 className="mt-1 text-xl font-semibold">{status}</h2>
          <p className="mt-1 text-xs text-white/45">{getDominantShock(model)} pattern</p>
        </div>
        <span className="rounded-md border border-white/15 px-3 py-2 font-accent text-xs text-[#a4d9d0]" aria-live="polite">
          {stage}
        </span>
      </div>

      <div className="mx-4 overflow-hidden rounded-lg border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/10 px-4 py-3">
          <p className="text-[10px] font-semibold text-white/45">ANATOMICAL CIRCULATION</p>
          <div className="flex gap-4 text-[10px] text-white/40">
            <span>Pulmonary circuit</span>
            <span>Systemic circuit</span>
            <span>Organ perfusion</span>
          </div>
        </div>
        <AnatomicalCirculation model={model} results={results} />
      </div>

      <div className="mt-auto flex flex-wrap justify-between gap-3 border-t border-white/10 px-5 py-3 text-[11px] text-white/45">
        <span>Flow overlays follow the pulmonary and systemic vessel anatomy.</span>
        <span>
          Circulatory system: Tomáš Kebert &amp; umimeto.org · CC BY-SA 4.0.
          Blood cells: NIAID/NIH BioArt · public domain.
        </span>
      </div>
    </div>
  );
}
