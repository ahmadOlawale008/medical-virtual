"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import StimulusStrengthChart from "./stimulus-strength-chart";
import StimulusStrengthControls from "./stimulus-strength-controls";
import {
  createStimulusStrengthRecording,
  STRENGTH_MAX_RESPONSE,
  STRENGTH_PLAYBACK_MS,
  STRENGTH_WINDOW_MS,
  type StimulusStrengthRecording,
} from "../stimulus-strength-model";

const MuscleScene = dynamic(
  () => import("../../simple-muscle-twitch/components/muscle-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">
        Preparing induction-coil apparatus…
      </div>
    ),
  },
);

export default function StimulusStrengthSimulator() {
  const [distance, setDistance] = useState(15);
  const [recordings, setRecordings] = useState<StimulusStrengthRecording[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const elapsedRef = useRef(0);
  const sequence = useRef(0);
  const latest = recordings.at(-1) ?? null;

  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now() - elapsedRef.current;
    let frame = 0;

    function update() {
      const nextElapsed = Math.min(
        STRENGTH_PLAYBACK_MS,
        performance.now() - startedAt,
      );
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);

      if (nextElapsed >= STRENGTH_PLAYBACK_MS) {
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
    const nextRecording = createStimulusStrengthRecording(
      sequence.current,
      distance,
    );
    setRecordings((current) => [...current, nextRecording]);
    elapsedRef.current = 0;
    setElapsedMs(0);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setRecordings([]);
    sequence.current = 0;
    elapsedRef.current = 0;
    setElapsedMs(0);
  }

  const phase = !running
    ? "idle"
    : elapsedMs < 200
      ? "make"
      : elapsedMs < 500
        ? "interval"
        : "break";

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <MuscleScene
          trace={latest}
          traces={recordings}
          showElectrodes
          recordingWindowMs={STRENGTH_WINDOW_MS}
          stimulusOffsetMs={0}
          forceAxisMax={STRENGTH_MAX_RESPONSE}
          playbackMs={STRENGTH_PLAYBACK_MS}
          simulationTimeMs={elapsedMs}
          recordingStyle="paired-lines"
          inductionCoilDistance={distance}
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-[#54d6df]/30 bg-[#192b32]/90 px-4 py-2 text-xs font-semibold text-[#69e3eb] shadow-sm backdrop-blur-sm">
          Du Bois–Reymond induction coil
        </div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <StimulusStrengthChart recordings={recordings} elapsedMs={elapsedMs} />
        <StimulusStrengthControls
          distance={distance}
          latest={latest}
          running={running}
          phase={phase}
          onDistanceChange={setDistance}
          onStimulate={stimulate}
          onReset={reset}
        />
      </aside>
    </div>
  );
}
