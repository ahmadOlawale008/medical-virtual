"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import TwoStimuliChart from "./two-stimuli-chart";
import TwoStimuliControls from "./two-stimuli-controls";
import {
  createTwoStimuliTrace,
  getPeriodForInterval,
  PERIOD_OPTIONS,
  TWO_STIMULI_MAX_FORCE,
  TWO_STIMULI_PLAYBACK_MS,
  TWO_STIMULI_WINDOW_MS,
  type StimulusPeriod,
  type TwoStimuliTrace,
} from "../two-stimuli-model";

const MuscleScene = dynamic(() => import("../../simple-muscle-twitch/components/muscle-scene"), {
  ssr: false,
  loading: () => <div className="flex min-h-[520px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">Preparing two-stimulus apparatus…</div>,
});

export default function TwoStimuliSimulator() {
  const [interval, setInterval] = useState(8);
  const [traces, setTraces] = useState<TwoStimuliTrace[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const sequence = useRef(0);
  const elapsedRef = useRef(0);
  const latestTrace = traces.at(-1) ?? null;
  const period = getPeriodForInterval(interval);

  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now() - elapsedRef.current;
    let frame = 0;
    const update = () => {
      const nextElapsed = Math.min(TWO_STIMULI_PLAYBACK_MS, performance.now() - startedAt);
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);
      if (nextElapsed >= TWO_STIMULI_PLAYBACK_MS) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  function stimulate() {
    sequence.current += 1;
    setTraces((current) => [...current, createTwoStimuliTrace(sequence.current, interval)]);
    elapsedRef.current = 0;
    setElapsedMs(0);
    setRunning(true);
  }

  function selectPeriod(nextPeriod: StimulusPeriod) {
    const option = PERIOD_OPTIONS.find((entry) => entry.value === nextPeriod);
    if (option) setInterval(option.interval);
  }

  function reset() {
    setRunning(false);
    setTraces([]);
    setElapsedMs(0);
    elapsedRef.current = 0;
  }

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <MuscleScene trace={latestTrace} traces={traces} showElectrodes recordingWindowMs={TWO_STIMULI_WINDOW_MS} stimulusOffsetMs={0} forceAxisMax={TWO_STIMULI_MAX_FORCE} playbackMs={TWO_STIMULI_PLAYBACK_MS} simulationTimeMs={elapsedMs} />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-black/10 bg-[#19263a] px-4 py-2 text-xs font-semibold text-white shadow-sm">Lucas chamber &amp; muscle · paired indirect stimuli</div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <TwoStimuliChart traces={traces} />
        <TwoStimuliControls interval={interval} period={period} latestTrace={latestTrace} running={running} onIntervalChange={setInterval} onPeriodSelect={selectPeriod} onStimulate={stimulate} onReset={reset} />
      </aside>
    </div>
  );
}
