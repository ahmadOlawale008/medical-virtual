"use client";

import { useMemo, useState } from "react";
import CirculationVisual from "./circulation-visual";
import ControlPanel from "./control-panel";
import ResultsPanel from "./results-panel";
import { calculateHemodynamics, getHemodynamicStatus, presets } from "./model";
import type { HeartFailureModel } from "./model";

export default function HeartFailureSimulator() {
  const [model, setModel] = useState(presets.Normal);
  const [stage, setStage] = useState("Normal");
  const results = useMemo(() => calculateHemodynamics(model), [model]);
  const status = getHemodynamicStatus(results);

  function updateModel(key: keyof HeartFailureModel, value: number) {
    setModel((current) => ({ ...current, [key]: value }));
    setStage("Custom trial");
  }

  function reset() {
    setModel(presets.Normal);
    setStage("Normal");
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/15 bg-[#102a28]">
      <div className="flex flex-wrap gap-2 border-b border-white/15 p-3">
        {Object.entries(presets).map(([name, values]) => (
          <button
            key={name}
            type="button"
            aria-pressed={stage === name}
            onClick={() => {
              setModel(values);
              setStage(name);
            }}
            className={`min-h-10 cursor-pointer rounded-md border px-3.5 text-xs font-semibold ${stage === name ? "border-secondary bg-secondary text-[#24140b]" : "border-white/15 text-white/70 hover:bg-white/10"}`}
          >
            {name}
          </button>
        ))}
        <span className="ml-auto hidden items-center text-xs text-white/40 sm:flex">
          Select a stage or adjust the controls
        </span>
      </div>
      <div className="grid min-h-[650px] xl:grid-cols-[270px_minmax(520px,1fr)_300px]">
        <ControlPanel model={model} onChange={updateModel} onReset={reset} />
        <CirculationVisual model={model} results={results} stage={stage} status={status} />
        <ResultsPanel model={model} results={results} />
      </div>
    </section>
  );
}
