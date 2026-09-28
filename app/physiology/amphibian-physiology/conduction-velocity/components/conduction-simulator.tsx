"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ConductionChart from "./conduction-chart";
import ConductionControls from "./conduction-controls";
import {
  CONDUCTION_MAX_FORCE,
  CONDUCTION_PLAYBACK_MS,
  CONDUCTION_WINDOW_MS,
  createConductionTrace,
  type ConductionTrace,
  type StimulationPoint,
} from "../conduction-model";

const MuscleScene = dynamic(() => import("../../simple-muscle-twitch/components/muscle-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[540px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">Preparing sciatic-nerve apparatus…</div>
  ),
});

export default function ConductionSimulator() {
  const [point, setPoint] = useState<StimulationPoint>("muscle");
  const [traces, setTraces] = useState<ConductionTrace[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const sequence = useRef(0);
  const latest = traces.at(-1) ?? null;

  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now();
    let frame = 0;

    function update() {
      const elapsed = Math.min(CONDUCTION_PLAYBACK_MS, performance.now() - startedAt);
      setElapsedMs(elapsed);
      if (elapsed >= CONDUCTION_PLAYBACK_MS) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  function stimulate() {
    if (running) return;
    sequence.current += 1;
    const next = createConductionTrace(sequence.current, point);
    setTraces((current) => [...current.filter((trace) => trace.point !== point), next]);
    setElapsedMs(0);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setTraces([]);
    setElapsedMs(0);
    sequence.current = 0;
  }

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <MuscleScene
          trace={latest}
          traces={traces}
          showElectrodes
          recordingWindowMs={CONDUCTION_WINDOW_MS}
          stimulusOffsetMs={0}
          forceAxisMax={CONDUCTION_MAX_FORCE}
          playbackMs={CONDUCTION_PLAYBACK_MS}
          simulationTimeMs={elapsedMs}
          drumTraceRadius={0.015}
          nerveStimulationPoint={point}
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-black/10 bg-[#19263a] px-4 py-2 text-xs font-semibold text-white shadow-sm">Lucas chamber · sciatic nerve–muscle preparation</div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <ConductionChart traces={traces} activeTraceId={latest?.id ?? null} elapsedMs={elapsedMs} running={running} />
        <ConductionControls point={point} traces={traces} running={running} onPointChange={setPoint} onStimulate={stimulate} onReset={reset} />
      </aside>
    </div>
  );
}
