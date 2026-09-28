import { FATIGUE_RUN_LIMIT, fatigueStage } from "../fatigue-model";

export default function FatigueControls({
  voltage,
  stimulusCount,
  running,
  autoRunning,
  onVoltageChange,
  onStimulate,
  onToggleAuto,
  onReset,
}: {
  voltage: number;
  stimulusCount: number;
  running: boolean;
  autoRunning: boolean;
  onVoltageChange: (voltage: number) => void;
  onStimulate: () => void;
  onToggleAuto: () => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[.13em] text-[#77c8bd]">
            STIMULATOR CONTROL
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white/80">
            Stimulus strength
          </h2>
        </div>
        <strong className="font-accent text-xl text-[#59a0ff]">
          {voltage.toFixed(1)} V
        </strong>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={voltage}
        disabled={running || autoRunning}
        onChange={(event) => onVoltageChange(Number(event.target.value))}
        className="mt-4 w-full cursor-pointer accent-[#438af0] disabled:cursor-not-allowed disabled:opacity-45"
        aria-label="Stimulus voltage"
      />
      <div className="mt-1 flex justify-between text-[9px] text-white/35">
        <span>0 V</span>
        <span>Threshold 0.3 V</span>
        <span>Maximal 4 V</span>
        <span>10 V</span>
      </div>
      <p className="mt-3 text-[10px] font-medium text-[#79c8bc]">
        {fatigueStage(stimulusCount)}
      </p>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          disabled={running || autoRunning || stimulusCount >= FATIGUE_RUN_LIMIT}
          onClick={onStimulate}
          className="cursor-pointer rounded-md bg-[#18a861] px-4 py-3 text-xs font-semibold text-white shadow-[0_8px_22px_rgba(24,168,97,.22)] transition hover:bg-[#1aba6b] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        >
          Stimulate
        </button>
        <button
          type="button"
          disabled={stimulusCount === 0}
          onClick={onReset}
          className="cursor-pointer rounded-md border border-white/12 bg-white/[.06] px-4 py-3 text-xs font-semibold text-white/65 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          Reset data
        </button>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_92px] gap-2">
        <button
          type="button"
          disabled={stimulusCount >= FATIGUE_RUN_LIMIT}
          onClick={onToggleAuto}
          className={`cursor-pointer rounded-md border px-4 py-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            autoRunning
              ? "border-[#a9554e] bg-[#7b302b]/28 text-[#ff8e83]"
              : "border-white/12 bg-white/[.05] text-white/70 hover:text-white"
          }`}
        >
          {autoRunning ? "Stop fatigue run" : "Start fatigue run"}
        </button>
        <div className="rounded-md border border-white/10 bg-black/15 px-3 py-2 text-center">
          <span className="block text-[9px] tracking-[.1em] text-white/35">STIMULI</span>
          <strong className="mt-0.5 block font-accent text-lg text-white/85">
            {stimulusCount}
          </strong>
        </div>
      </div>
    </section>
  );
}

