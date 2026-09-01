"use client";

import { useMemo, useState } from "react";
import ControlPanel from "./control-panel";
import MetabolicVisual from "./metabolic-visual";
import ResultsPanel from "./results-panel";
import { calculateDka, dkaPresets, getDkaState } from "./model";
import type { DkaModel } from "./model";

export default function DkaSimulator() {
  const [model, setModel] = useState(dkaPresets.Normal);
  const [stage, setStage] = useState("Normal");
  const results = useMemo(() => calculateDka(model), [model]);

  function update(key: keyof DkaModel, value: number) {
    setModel((current) => ({ ...current, [key]: value }));
    setStage("Custom trial");
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/15 bg-[#102a28]">
      <div className="flex flex-wrap gap-2 border-b border-white/15 p-3">
        {Object.entries(dkaPresets).map(([name, values]) => (
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
      </div>

      <div className="grid min-h-[720px] xl:grid-cols-[270px_minmax(680px,1fr)_320px]">
        <ControlPanel
          model={model}
          onChange={update}
          onReset={() => {
            setModel(dkaPresets.Normal);
            setStage("Normal");
          }}
        />
        <MetabolicVisual
          model={model}
          results={results}
          stage={stage}
          status={getDkaState(results)}
        />
        <ResultsPanel results={results} />
      </div>
    </section>
  );
}
