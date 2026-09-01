"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Oscilloscope from "./oscilloscope";
import StimulatorControls from "./stimulator-controls";
import { createTwitchTrace, type StimulationMode, type TwitchTrace } from "../twitch-model";

const MuscleScene = dynamic(() => import("./muscle-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[520px] items-center justify-center bg-[#dbe4eb] text-xs text-[#50666b]">
      Preparing 3D apparatus…
    </div>
  ),
});

export default function SimpleTwitchSimulator() {
  const [voltage, setVoltage] = useState(3.5);
  const [mode, setMode] = useState<StimulationMode>("indirect");
  const [trace, setTrace] = useState<TwitchTrace | null>(null);
  const [sequence, setSequence] = useState(0);

  function stimulate() {
    const nextSequence = sequence + 1;
    setSequence(nextSequence);
    setTrace(createTwitchTrace(nextSequence, voltage, mode));
  }

  function reset() {
    setTrace(null);
    setSequence(0);
  }

  function changeVoltage(value: number) {
    setVoltage(value);
    setTrace(null);
  }

  function changeMode(nextMode: StimulationMode) {
    setMode(nextMode);
    setTrace(null);
  }

  return (
    <div className="grid min-h-[calc(100dvh-74px)] bg-[#0b1c27] xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
        <MuscleScene trace={trace} />
      </section>
      <aside className="grid content-start gap-3 overflow-y-auto p-4 sm:p-5">
        <Oscilloscope trace={trace} />
        <StimulatorControls
          voltage={voltage}
          mode={mode}
          trace={trace}
          onVoltageChange={changeVoltage}
          onModeChange={changeMode}
          onStimulate={stimulate}
          onReset={reset}
        />
      </aside>
    </div>
  );
}
