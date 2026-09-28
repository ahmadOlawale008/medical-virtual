import {
  distanceToVoltage,
  strengthPresets,
  type StimulusStrengthRecording,
} from "../stimulus-strength-model";

export default function StimulusStrengthControls({
  distance,
  latest,
  running,
  phase,
  onDistanceChange,
  onStimulate,
  onReset,
}: {
  distance: number;
  latest: StimulusStrengthRecording | null;
  running: boolean;
  phase: "idle" | "make" | "interval" | "break";
  onDistanceChange: (distance: number) => void;
  onStimulate: () => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
      <p className="text-[10px] font-semibold tracking-[.13em] text-[#f3c41d]">
        EXPERIMENT CONTROLS
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white/85">
            Stimulus strength
          </h2>
          <p className="mt-1 text-[10px] text-white/40">Coil separation controls induction strength.</p>
        </div>
        <div className="flex gap-3 text-right font-accent">
          <div>
            <p className="text-[9px] tracking-wider text-white/35">VOLTAGE</p>
            <p className="text-lg text-[#f5c518]">{distanceToVoltage(distance).toFixed(1)} V</p>
          </div>
          <div>
            <p className="text-[9px] tracking-wider text-white/35">DISTANCE</p>
            <p className="text-lg text-[#54d6df]">{distance} cm</p>
          </div>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="15"
        step="1"
        value={15 - distance}
        disabled={running}
        onChange={(event) => onDistanceChange(15 - Number(event.target.value))}
        className="mt-4 w-full cursor-pointer accent-[#54d6df] disabled:cursor-not-allowed"
        aria-label="Distance between primary and secondary induction coils"
      />
      <div className="mt-1 flex justify-between text-[10px] text-white/35">
        <span>15 cm · weak</span>
        <span>0 cm · strong</span>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {strengthPresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            disabled={running}
            onClick={() => onDistanceChange(preset.distance)}
            className={`min-h-12 cursor-pointer rounded-md border px-1.5 py-2 text-[9px] font-semibold leading-3 transition disabled:cursor-not-allowed ${
              distance === preset.distance
                ? "border-[#54d6df] bg-[#54d6df]/15 text-[#67e3eb]"
                : "border-white/10 bg-black/10 text-white/50 hover:bg-white/[.06] hover:text-white"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-5 text-xs text-white/55" aria-live="polite">
        {phase === "make" && <span className="text-[#f5c518]">Recording Make response…</span>}
        {phase === "interval" && <span>Contact held before Break…</span>}
        {phase === "break" && <span className="text-[#ff8589]">Recording Break response…</span>}
        {phase === "idle" && latest && (
          <span>Make {latest.makeForce.toFixed(1)} · Break {latest.breakForce.toFixed(1)}</span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          disabled={running}
          onClick={onStimulate}
          className="cursor-pointer rounded-md bg-gradient-to-r from-[#f5c400] to-[#ea8500] px-4 py-3 text-sm font-semibold text-[#111] shadow-[0_8px_24px_rgba(245,180,0,.18)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {running ? "Recording…" : "⚡ Stimulate (Make & Break)"}
        </button>
        <button
          type="button"
          disabled={!latest || running}
          onClick={onReset}
          className="cursor-pointer rounded-md border border-white/12 bg-white/[.06] px-5 py-3 text-xs font-semibold text-white/70 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
