"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import CardiogramChart from "./cardiogram-chart";
import CardiogramControls from "./cardiogram-controls";
import useHeartbeatSound from "./use-heartbeat-sound";
import {
  CARDIOGRAM_DURATION_MS,
  CARDIOGRAM_SAMPLE_INTERVAL_MS,
  getCardiacState,
  type CardiogramSample,
  type CardiogramTemperature,
} from "../cardiogram-model";

const CARDIAC_DIP_PHASES = [
  { phase: 0.16, accent: "primary" as const },
  { phase: 0.56, accent: "secondary" as const },
];

function crossedPhase(previous: number, current: number, target: number) {
  if (current >= previous) {
    return previous < target && current >= target;
  }

  // The normalized cardiac phase wrapped from the end of one cycle to zero.
  return previous < target || current >= target;
}

const FrogHeartScene = dynamic(() => import("./frog-heart-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[560px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">
      Preparing frog-heart apparatus…
    </div>
  ),
});

export default function CardiogramSimulator() {
  const [temperature, setTemperature] = useState<CardiogramTemperature>(25);
  const [drumSpeed, setDrumSpeed] = useState(2.5);
  const [recording, setRecording] = useState(false);
  const [simulationTimeMs, setSimulationTimeMs] = useState(0);
  const [samples, setSamples] = useState<CardiogramSample[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const elapsedRef = useRef(0);
  const lastSampleRef = useRef(-CARDIOGRAM_SAMPLE_INTERVAL_MS);
  const previousPhaseRef = useRef<number | null>(null);
  const temperatureRef = useRef(temperature);
  const {
    enabled: soundEnabled,
    enable: enableHeartbeat,
    toggle: toggleHeartbeat,
    playBeat,
  } = useHeartbeatSound();

  useEffect(() => {
    temperatureRef.current = temperature;
  }, [temperature]);

  useEffect(() => {
    if (!recording) return;
    const startedAt = performance.now() - elapsedRef.current;
    let frame = 0;

    function update() {
      const nextElapsed = Math.min(
        CARDIOGRAM_DURATION_MS,
        performance.now() - startedAt,
      );
      elapsedRef.current = nextElapsed;
      setSimulationTimeMs(nextElapsed);
      const currentTemperature = temperatureRef.current;
      const state = getCardiacState(nextElapsed, currentTemperature);

      if (previousPhaseRef.current !== null) {
        for (const dip of CARDIAC_DIP_PHASES) {
          if (crossedPhase(previousPhaseRef.current, state.phase, dip.phase)) {
            playBeat(dip.accent);
          }
        }
      }
      previousPhaseRef.current = state.phase;

      if (
        nextElapsed - lastSampleRef.current >=
        CARDIOGRAM_SAMPLE_INTERVAL_MS
      ) {
        lastSampleRef.current = nextElapsed;
        setSamples((current) => [
          ...current,
          {
            time: nextElapsed,
            force: state.force,
            temperature: currentTemperature,
          },
        ]);
      }

      if (nextElapsed >= CARDIOGRAM_DURATION_MS) {
        setRecording(false);
        return;
      }
      frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [playBeat, recording]);

  function toggleRecording() {
    if (recording) {
      setRecording(false);
      return;
    }
    if (elapsedRef.current >= CARDIOGRAM_DURATION_MS) return;
    previousPhaseRef.current = getCardiacState(
      elapsedRef.current,
      temperature,
    ).phase;
    void enableHeartbeat();
    setRecording(true);
  }

  function reset() {
    setRecording(false);
    setSamples([]);
    elapsedRef.current = 0;
    lastSampleRef.current = -CARDIOGRAM_SAMPLE_INTERVAL_MS;
    previousPhaseRef.current = null;
    setSimulationTimeMs(0);
    setResetKey((current) => current + 1);
  }

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <FrogHeartScene
          temperature={temperature}
          recording={recording}
          simulationTimeMs={simulationTimeMs}
          drumSpeed={drumSpeed}
          resetKey={resetKey}
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-black/10 bg-[#19263a] px-4 py-2 text-xs font-semibold text-white shadow-sm">
          Pithed frog · Starling heart lever
        </div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <CardiogramChart
          samples={samples}
          temperature={temperature}
        />
        <CardiogramControls
          temperature={temperature}
          drumSpeed={drumSpeed}
          recording={recording}
          hasRecording={samples.length > 0}
          soundEnabled={soundEnabled}
          onTemperatureChange={setTemperature}
          onDrumSpeedChange={setDrumSpeed}
          onToggleRecording={toggleRecording}
          onReset={reset}
          onToggleSound={toggleHeartbeat}
        />
      </aside>
    </div>
  );
}
