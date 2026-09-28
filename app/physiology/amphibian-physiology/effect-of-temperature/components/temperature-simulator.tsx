"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import TemperatureChart from "./temperature-chart";
import TemperatureControls from "./temperature-controls";
import {
  createTemperatureRecording,
  TEMPERATURE_WINDOW_MS,
  type TemperatureRecording,
} from "../temperature-model";

const MuscleScene = dynamic(
  () => import("../../simple-muscle-twitch/components/muscle-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">
        Preparing temperature apparatus…
      </div>
    ),
  },
);

export default function TemperatureSimulator() {
  const [temperature, setTemperature] = useState(25);
  const [recordings, setRecordings] = useState<TemperatureRecording[]>([]);
  const [sequence, setSequence] = useState(0);
  const trace = recordings.at(-1) ?? null;

  function changeTemperature(nextTemperature: number) {
    setTemperature(nextTemperature);
  }

  function stimulate() {
    const nextSequence = sequence + 1;
    const nextRecording = createTemperatureRecording(nextSequence, temperature);
    setSequence(nextSequence);
    setRecordings((current) => [...current, nextRecording]);
  }

  function reset() {
    setRecordings([]);
    setSequence(0);
    setTemperature(25);
  }

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <MuscleScene
          trace={trace}
          traces={recordings}
          temperature={temperature}
          showElectrodes
          recordingWindowMs={TEMPERATURE_WINDOW_MS}
          stimulusOffsetMs={0}
          forceAxisMax={10}
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-black/10 bg-[#19263a] px-4 py-2 text-xs font-semibold text-white shadow-sm">
          Lucas chamber &amp; muscle · Ringer&apos;s solution
        </div>
      </section>
      <aside className="grid content-start gap-5 overflow-y-auto p-4 sm:p-5">
        <TemperatureChart recordings={recordings} />
        <TemperatureControls
          temperature={temperature}
          onTemperatureChange={changeTemperature}
          onStimulate={stimulate}
          onReset={reset}
        />
      </aside>
    </div>
  );
}
