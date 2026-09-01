"use client";

import { useState } from "react";
import MetabolicCanvas from "./metabolic-canvas";
import type { DkaModel, DkaResults } from "./model";

type Props = {
  model: DkaModel;
  results: DkaResults;
  stage: string;
  status: string;
};

export default function MetabolicVisual({ model, results, stage, status }: Props) {
  const [running, setRunning] = useState(true);

  const mechanisms = [
    ["Cellular uptake", results.cellularUptake, "#148b7e"],
    ["Lipolysis", results.lipolysis, "#d39a2f"],
    ["Ketogenesis", results.ketogenesis, "#c74b3e"],
    ["Osmotic diuresis", results.osmoticDiuresis, "#438da7"],
  ] as const;

  return (
    <div className="relative flex min-h-[720px] flex-col overflow-hidden border-b border-white/15 xl:border-b-0 xl:border-r">
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] text-white/40">CURRENT METABOLIC STATE</p>
          <h2 className="mt-1 text-xl font-semibold">{status}</h2>
          <p className="mt-1 text-xs text-white/45">Insulin–ketone pathway</p>
        </div>
        <span className="rounded-md border border-white/15 px-3 py-2 font-accent text-xs text-[#a4d9d0]">
          {stage}
        </span>
      </div>

      <div className="mx-4 overflow-hidden rounded-lg border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/10 px-4 py-3">
          <p className="text-[10px] font-semibold text-white/45">LIVE METABOLIC PATHWAY</p>
          <button
            type="button"
            onClick={() => setRunning((current) => !current)}
            className="min-h-8 cursor-pointer rounded-md border border-white/15 px-3 text-[10px] font-semibold text-white/70 hover:bg-white/10"
          >
            {running ? "Pause particles" : "Run particles"}
          </button>
        </div>

        <div className="h-[500px] bg-[#f5f2ef]">
          <MetabolicCanvas model={model} results={results} running={running} />
        </div>

        <div className="grid gap-px border-t border-[#ddd5cf] bg-[#ddd5cf] sm:grid-cols-4">
          {mechanisms.map(([label, value, color]) => (
            <div key={label} className="bg-white px-3 py-3 text-foreground">
              <div className="flex items-center justify-between gap-2 text-[9px] text-muted">
                <span>{label}</span>
                <strong className="font-accent text-[10px] text-foreground">{value.toFixed(0)}%</strong>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e8e1dc]">
                <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${clampPercent(value)}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-wrap justify-between gap-3 border-t border-white/10 px-5 py-3 text-[11px] text-white/45">
        <span>Particles show substrate movement, not absolute molecule counts.</span>
        <span>Glucose = hexagon · Fatty acid = circle · Ketone = diamond · Water = drop</span>
      </div>
    </div>
  );
}

function clampPercent(value: number) {
  return Math.min(Math.max(value, 3), 100);
}
