"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import PropertiesChart from "./properties-chart";
import PropertiesControls from "./properties-controls";
import useHeartbeatSound from "../../normal-cardiogram/components/use-heartbeat-sound";
import {
  PROPERTY_SAMPLE_MS,
  getPropertyState,
  stimulusIsActive,
  type CardiacExperiment,
  type PropertySample,
} from "../cardiac-properties-model";

const FrogHeartScene = dynamic(
  () => import("../../normal-cardiogram/components/frog-heart-scene"),
  { ssr: false, loading: () => <div className="flex min-h-[560px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">Preparing cardiac apparatus…</div> },
);

export default function PropertiesSimulator() {
  const [experiment, setExperiment] = useState<CardiacExperiment>("extrasystole");
  const [recording, setRecording] = useState(false);
  const [drumSpeed, setDrumSpeed] = useState(2.5);
  const [timeMs, setTimeMs] = useState(0);
  const [samples, setSamples] = useState<PropertySample[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const elapsedRef = useRef(0);
  const lastSampleRef = useRef(-PROPERTY_SAMPLE_MS);
  const previousPhaseRef = useRef<number | null>(null);
  const { enabled: soundEnabled, enable: enableHeartbeat, toggle: toggleHeartbeat, playBeat } = useHeartbeatSound();
  const state = getPropertyState(timeMs, experiment);
  const force = state.force;
  const heartRate = state.heartRate;

  useEffect(() => {
    if (!recording) return;
    const startedAt = performance.now() - elapsedRef.current;
    let frame = 0;
    const update = () => {
      const elapsed = performance.now() - startedAt;
      elapsedRef.current = elapsed;
      setTimeMs(elapsed);
      const nextState = getPropertyState(elapsed, experiment);
      if (!nextState.silent && nextState.phase >= 0 && previousPhaseRef.current !== null) {
        const previous = previousPhaseRef.current;
        for (const [dip, accent] of [[0.16, "primary"], [0.56, "secondary"]] as const) {
          const crossed = nextState.phase >= previous
            ? previous < dip && nextState.phase >= dip
            : previous < dip || nextState.phase >= dip;
          if (crossed) playBeat(accent);
        }
      }
      previousPhaseRef.current = nextState.phase;
      if (elapsed - lastSampleRef.current >= PROPERTY_SAMPLE_MS) {
        lastSampleRef.current = elapsed;
        setSamples((current) => [...current, { time: elapsed, force: nextState.force }]);
      }
      if (nextState.complete) {
        setRecording(false);
        return;
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [experiment, playBeat, recording]);

  const reset = () => {
    setRecording(false);
    setSamples([]);
    setTimeMs(0);
    elapsedRef.current = 0;
    lastSampleRef.current = -PROPERTY_SAMPLE_MS;
    previousPhaseRef.current = null;
    setResetKey((value) => value + 1);
  };

  const changeExperiment = (value: CardiacExperiment) => {
    reset();
    setExperiment(value);
    setDrumSpeed(value === "heart-block" ? 1 : value === "all-or-none" ? 1.5 : 2.5);
  };

  const toggleRecording = () => {
    if (recording) return setRecording(false);
    if (!getPropertyState(elapsedRef.current, experiment).complete) {
      void enableHeartbeat();
      setRecording(true);
    }
  };

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <FrogHeartScene temperature={25} recording={recording} simulationTimeMs={timeMs} drumSpeed={drumSpeed} resetKey={resetKey} forceOverride={Math.max(0, 3 - force)} traceOverride={force} traceTravel={(timeMs / 1000) * drumSpeed * 15 / 2048} showTapKey stimulusActive={stimulusIsActive(timeMs, experiment)} />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-black/10 bg-[#19263a] px-4 py-2 text-xs font-semibold text-white shadow-sm">Pithed frog · tap key · Starling heart lever</div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <PropertiesChart samples={samples} drumSpeed={drumSpeed} />
        <PropertiesControls experiment={experiment} drumSpeed={drumSpeed} heartRate={heartRate} soundEnabled={soundEnabled} recording={recording} hasRecording={samples.length > 0} onExperimentChange={changeExperiment} onDrumSpeedChange={setDrumSpeed} onToggleSound={toggleHeartbeat} onToggleRecording={toggleRecording} onReset={reset} />
      </aside>
    </div>
  );
}
