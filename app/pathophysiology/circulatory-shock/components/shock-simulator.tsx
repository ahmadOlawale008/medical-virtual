"use client";

import { useMemo, useState } from "react";
import ControlPanel from "./control-panel";
import { calculateShock, getShockStatus, shockPresets } from "./model";
import type { ShockModel } from "./model";
import ResultsPanel from "./results-panel";
import ShockVisual from "./shock-visual";

export default function ShockSimulator() {
  const [model, setModel] = useState(shockPresets.Normal);
  const [stage, setStage] = useState("Normal");
  const results = useMemo(() => calculateShock(model), [model]);

  function update(key: keyof ShockModel, value: number) {
    setModel((current) => ({ ...current, [key]: value }));
    setStage("Custom trial");
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/15 bg-[#102a28]">
      <div className="flex flex-wrap gap-2 border-b border-white/15 p-3">
        {Object.entries(shockPresets).map(([name, values]) => (
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

      <div className="grid min-h-[720px] xl:grid-cols-[270px_minmax(650px,1fr)_310px]">
        <ControlPanel
          model={model}
          onChange={update}
          onReset={() => {
            setModel(shockPresets.Normal);
            setStage("Normal");
          }}
        />
        <ShockVisual model={model} results={results} stage={stage} status={getShockStatus(results)} />
        <ResultsPanel model={model} results={results} />
      </div>
    </section>
  );
}
