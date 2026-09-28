"use client";

import {
  calculateConductionVelocity,
  NERVE_DISTANCE_CM,
  type ConductionTrace,
  type StimulationPoint,
} from "../conduction-model";

export default function ConductionControls({
  point,
  traces,
  running,
  onPointChange,
  onStimulate,
  onReset,
}: {
  point: StimulationPoint;
  traces: ConductionTrace[];
  running: boolean;
  onPointChange: (point: StimulationPoint) => void;
  onStimulate: () => void;
  onReset: () => void;
}) {
  const muscle = traces.find((trace) => trace.point === "muscle");
  const vertebral = traces.find((trace) => trace.point === "vertebral");
  const velocity = calculateConductionVelocity(muscle, vertebral);

  return (
    <section className="rounded-xl border border-white/10 bg-white/[.07] p-5 shadow-xl">
      <p className="text-[10px] font-semibold tracking-[.13em] text-[#70a9ff]">STIMULATOR CONTROL</p>
      <h2 className="mt-2 text-base font-semibold text-white/85">Stimulation point</h2>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {(["muscle", "vertebral"] as const).map((option) => (
          <button
            key={option}
            type="button"
            disabled={running}
            onClick={() => onPointChange(option)}
            className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${point === option ? "border-[#4a8cf7] bg-[#2563eb]/20 text-[#9ec5ff]" : "border-white/12 bg-white/[.04] text-white/55 hover:border-white/25"} disabled:cursor-not-allowed disabled:opacity-55`}
          >
            {option === "muscle" ? "Muscle End" : "Vertebral End"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" disabled={running} onClick={onStimulate} className="rounded-lg bg-[#2d6eea] px-4 py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(45,110,234,.3)] transition hover:bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-55">
          {running ? "Recording…" : "⚡ Stimulate"}
        </button>
        <button type="button" disabled={running || traces.length === 0} onClick={onReset} className="rounded-lg border border-white/10 bg-white/[.06] px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35">
          ↻ Reset
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
        <Result label="LP₁ · Muscle" value={muscle ? `${muscle.latency} ms` : "—"} />
        <Result label="LP₂ · Vertebral" value={vertebral ? `${vertebral.latency} ms` : "—"} />
        <Result label="Nerve distance" value={`${NERVE_DISTANCE_CM} cm`} />
        <Result label="Velocity" value={velocity ? `${velocity.toFixed(1)} m/s` : "Record both"} accent />
      </div>
      <p className="mt-4 text-[10px] leading-4 text-white/42">Record both sites. Velocity = distance ÷ (LP₂ − LP₁).</p>
    </section>
  );
}

function Result({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/15 p-3">
      <p className="text-[10px] text-white/40">{label}</p>
      <p className={`mt-1 font-accent text-sm font-semibold ${accent ? "text-[#62dfa5]" : "text-white/80"}`}>{value}</p>
    </div>
  );
}
