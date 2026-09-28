"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import TetanusChart from "./tetanus-chart";
import TetanusControls from "./tetanus-controls";
import {
  createTetanusTrace,
  TETANUS_MAX_FORCE,
  TETANUS_WINDOW_MS,
  type TetanusTrace,
} from "../tetanus-model";

const MuscleScene = dynamic(
  () => import("../../simple-muscle-twitch/components/muscle-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">
        Preparing tetanus apparatus…
      </div>
    ),
  },
);

export default function TetanusSimulator() {
  const [frequency, setFrequency] = useState(5);
  const [trace, setTrace] = useState<TetanusTrace | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const sequence = useRef(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now() - elapsedRef.current;
    let frame = 0;

    function update() {
      const nextElapsed = Math.min(
        TETANUS_WINDOW_MS,
        performance.now() - startedAt,
      );
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);
      if (nextElapsed >= TETANUS_WINDOW_MS) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  function start() {
    sequence.current += 1;
    setTrace(createTetanusTrace(sequence.current, frequency));
    elapsedRef.current = 0;
    setElapsedMs(0);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setTrace(null);
    elapsedRef.current = 0;
    setElapsedMs(0);
  }

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <MuscleScene
          trace={trace}
          recordingWindowMs={TETANUS_WINDOW_MS}
          stimulusOffsetMs={0}
          forceAxisMax={TETANUS_MAX_FORCE}
          playbackMs={TETANUS_WINDOW_MS}
          simulationTimeMs={elapsedMs}
          drumRevolutions={1}
          wrapTraceAroundDrum
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-black/10 bg-[#19263a] px-4 py-2 text-xs font-semibold text-white shadow-sm">
          Lucas chamber · repeated indirect stimulation
        </div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <TetanusChart trace={trace} elapsedMs={elapsedMs} />
        <TetanusControls
          frequency={frequency}
          running={running}
          hasRecording={trace !== null}
          onFrequencyChange={setFrequency}
          onStart={start}
          onStop={() => setRunning(false)}
          onReset={reset}
        />
      </aside>
    </div>
  );
}
