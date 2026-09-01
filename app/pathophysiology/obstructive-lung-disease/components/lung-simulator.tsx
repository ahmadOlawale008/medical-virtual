"use client";

import { useMemo, useState } from "react";
import ControlPanel from "./control-panel";
import LungVisual from "./lung-visual";
import ResultsPanel from "./results-panel";
import { calculateLungFunction, getLungStatus, lungPresets } from "./model";
import type { LungModel } from "./model";

export default function LungSimulator() {
  const [model, setModel] = useState(lungPresets.Normal);
  const [stage, setStage] = useState("Normal");
  const results = useMemo(() => calculateLungFunction(model), [model]);

  function update(key: keyof LungModel, value: number) {
    setModel((current) => ({ ...current, [key]: value }));
    setStage("Custom trial");
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/15 bg-[#102a28]">
      <div className="flex flex-wrap gap-2 border-b border-white/15 p-3">
        {Object.entries(lungPresets).map(([name, values]) => <button key={name} type="button" aria-pressed={stage === name} onClick={() => { setModel(values); setStage(name); }} className={`min-h-10 cursor-pointer rounded-md border px-3.5 text-xs font-semibold ${stage === name ? "border-secondary bg-secondary text-[#24140b]" : "border-white/15 text-white/70 hover:bg-white/10"}`}>{name}</button>)}
      </div>
      <div className="grid min-h-[680px] xl:grid-cols-[270px_minmax(620px,1fr)_300px]">
        <ControlPanel model={model} onChange={update} onReset={() => { setModel(lungPresets.Normal); setStage("Normal"); }} />
        <LungVisual model={model} results={results} stage={stage} status={getLungStatus(results)} />
        <ResultsPanel model={model} results={results} />
      </div>
    </section>
  );
}
