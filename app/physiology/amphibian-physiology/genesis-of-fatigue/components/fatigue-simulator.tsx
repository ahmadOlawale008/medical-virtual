"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import FatigueChart from "./fatigue-chart";
import FatigueControls from "./fatigue-controls";
import {
  createFatigueTrace,
  FATIGUE_MAX_FORCE,
  FATIGUE_PLAYBACK_MS,
  FATIGUE_RUN_LIMIT,
  FATIGUE_WINDOW_MS,
  type FatigueTrace,
} from "../fatigue-model";

const MuscleScene = dynamic(
  () => import("../../simple-muscle-twitch/components/muscle-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">
        Preparing fatigue apparatus…
      </div>
    ),
  },
);

export default function FatigueSimulator() {
  const [voltage, setVoltage] = useState(4);
  const [recordings, setRecordings] = useState<FatigueTrace[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [autoRunning, setAutoRunning] = useState(false);
  const elapsedRef = useRef(0);
  const sequence = useRef(0);
  const latest = recordings.at(-1) ?? null;

  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now() - elapsedRef.current;
    let frame = 0;

    function update() {
      const nextElapsed = Math.min(
        FATIGUE_PLAYBACK_MS,
        performance.now() - startedAt,
      );
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);

      if (nextElapsed >= FATIGUE_PLAYBACK_MS) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  useEffect(() => {
    if (!autoRunning || running) return;
    if (sequence.current >= FATIGUE_RUN_LIMIT) {
      setAutoRunning(false);
      return;
    }

    const timer = window.setTimeout(() => {
      sequence.current += 1;
      const nextTrace = createFatigueTrace(sequence.current, voltage);
      setRecordings((current) => [...current, nextTrace]);
      elapsedRef.current = 0;
      setElapsedMs(0);
      setRunning(true);
    }, 110);

    return () => window.clearTimeout(timer);
  }, [autoRunning, running, voltage]);

  function stimulate() {
    if (running || sequence.current >= FATIGUE_RUN_LIMIT) return;
    sequence.current += 1;
    const nextTrace = createFatigueTrace(sequence.current, voltage);
    setRecordings((current) => [...current, nextTrace]);
    elapsedRef.current = 0;
    setElapsedMs(0);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setAutoRunning(false);
    setRecordings([]);
    sequence.current = 0;
    elapsedRef.current = 0;
    setElapsedMs(0);
  }

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <MuscleScene
          trace={latest}
          traces={recordings}
          showElectrodes
          recordingWindowMs={FATIGUE_WINDOW_MS}
          stimulusOffsetMs={0}
          forceAxisMax={FATIGUE_MAX_FORCE}
          playbackMs={FATIGUE_PLAYBACK_MS}
          simulationTimeMs={elapsedMs}
          drumTraceRadius={0.012}
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-black/10 bg-[#19263a] px-4 py-2 text-xs font-semibold text-white shadow-sm">
          Lucas chamber · repeated indirect stimulation
        </div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <FatigueChart recordings={recordings} elapsedMs={elapsedMs} />
        <FatigueControls
          voltage={voltage}
          stimulusCount={recordings.length}
          running={running}
          autoRunning={autoRunning}
          onVoltageChange={setVoltage}
          onStimulate={stimulate}
          onToggleAuto={() => setAutoRunning((current) => !current)}
          onReset={reset}
        />
      </aside>
    </div>
  );
}
