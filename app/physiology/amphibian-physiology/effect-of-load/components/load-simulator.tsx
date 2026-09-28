"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import LoadChart from "./load-chart";
import LoadControls from "./load-controls";
import {
  createLoadRecording,
  LOAD_AXIS_MAX,
  LOAD_PLAYBACK_MS,
  LOAD_WINDOW_MS,
  type LoadMode,
  type LoadRecording,
} from "../load-model";

const MuscleScene = dynamic(
  () => import("../../simple-muscle-twitch/components/muscle-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">
        Preparing load apparatus…
      </div>
    ),
  },
);

export default function LoadSimulator() {
  const [load, setLoad] = useState(70);
  const [mode, setMode] = useState<LoadMode>("afterloaded");
  const [display, setDisplay] = useState<"curve" | "line">("curve");
  const [recordings, setRecordings] = useState<LoadRecording[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const sequence = useRef(0);
  const elapsedRef = useRef(0);
  const latest = recordings.at(-1) ?? null;

  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now() - elapsedRef.current;
    let frame = 0;

    const update = () => {
      const nextElapsed = Math.min(
        LOAD_PLAYBACK_MS,
        performance.now() - startedAt,
      );
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);
      if (nextElapsed >= LOAD_PLAYBACK_MS) {
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
    setRecordings((current) => [
      ...current,
      createLoadRecording(sequence.current, load, mode),
    ]);
    elapsedRef.current = 0;
    setElapsedMs(0);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setRecordings([]);
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
          recordingWindowMs={LOAD_WINDOW_MS}
          stimulusOffsetMs={0}
          forceAxisMax={LOAD_AXIS_MAX}
          playbackMs={LOAD_PLAYBACK_MS}
          simulationTimeMs={elapsedMs}
          loadGrams={load}
          loadMode={mode}
          recordingStyle={display}
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-black/10 bg-[#19263a] px-4 py-2 text-xs font-semibold text-white shadow-sm">
          Lucas chamber &amp; muscle · adjustable load
        </div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <LoadChart
          recordings={recordings}
          load={load}
          mode={mode}
          display={display}
          onDisplayChange={setDisplay}
        />
        <LoadControls
          load={load}
          mode={mode}
          latest={latest}
          running={running}
          onLoadChange={setLoad}
          onModeChange={setMode}
          onStimulate={stimulate}
          onReset={reset}
        />
      </aside>
    </div>
  );
}
