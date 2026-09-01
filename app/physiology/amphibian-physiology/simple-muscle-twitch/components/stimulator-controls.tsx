import {
  getStimulationParameters,
  getStimulusPhase,
  type StimulationMode,
  type TwitchTrace,
} from "../twitch-model";

export default function StimulatorControls({
  voltage,
  mode,
  trace,
  onVoltageChange,
  onModeChange,
  onStimulate,
  onReset,
}: {
  voltage: number;
  mode: StimulationMode;
  trace: TwitchTrace | null;
  onVoltageChange: (value: number) => void;
  onModeChange: (mode: StimulationMode) => void;
  onStimulate: () => void;
  onReset: () => void;
}) {
  const { threshold, maximalVoltage } = getStimulationParameters(mode);
  const phase = getStimulusPhase(voltage, mode);
  const phaseLabel = {
    subthreshold: "Below threshold — no twitch expected",
    recruitment: "Recruitment range — force rises with voltage",
    maximal: "Maximal stimulus — force has reached its plateau",
  }[phase];

  return (
    <>
      <div className="grid grid-cols-2 rounded-lg bg-black/20 p-1">
        {(["indirect", "direct"] as StimulationMode[]).map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => onModeChange(value)}
            className={`cursor-pointer rounded-md px-3 py-2.5 text-xs font-semibold capitalize transition ${
              mode === value ? "bg-secondary text-[#17302c]" : "text-white/55 hover:text-white"
            }`}
          >
            {value} {value === "indirect" ? "(nerve)" : "(muscle)"}
          </button>
        ))}
      </div>

      <section className="rounded-lg border border-white/10 bg-black/20 p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[.12em] text-white/45">STIMULATOR CONTROL</p>
            <h2 className="mt-1 text-sm font-semibold text-white">Stimulus strength</h2>
          </div>
          <strong className="font-accent text-lg text-[#79c8bc]">{voltage.toFixed(1)} V</strong>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={voltage}
          onChange={(event) => onVoltageChange(Number(event.target.value))}
          className="lab-range mt-4 w-full cursor-pointer"
          aria-label="Stimulus voltage"
        />
        <div className="flex justify-between text-[9px] text-white/38">
          <span>0 V</span>
          <span>Threshold {threshold} V</span>
          <span>Maximal {maximalVoltage} V</span>
          <span>10 V</span>
        </div>
        <p className="mt-2 text-[10px] font-medium text-[#79c8bc]">
          {phaseLabel}
        </p>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={onStimulate}
            className="cursor-pointer rounded-md bg-[#18a861] px-4 py-3 text-xs font-semibold text-white shadow-[0_8px_22px_rgba(24,168,97,.22)] transition hover:bg-[#1aba6b] active:translate-y-px"
          >
            Stimulate
          </button>
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer rounded-md border border-white/12 bg-white/7 px-4 py-3 text-xs font-semibold text-white/65 transition hover:text-white"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg bg-[#f6f7f4] p-4 text-foreground" aria-live="polite">
        <p className="text-[10px] font-semibold tracking-[.12em] text-primary">LAST RESPONSE</p>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
          <Metric label="Peak force" value={trace ? `${trace.peakForce.toFixed(2)} g` : "—"} />
          <Metric label="Latent period" value={trace ? `${trace.latency} ms` : "—"} />
          <Metric label="Contraction" value={trace ? `${trace.contraction} ms` : "—"} />
          <Metric label="Relaxation" value={trace ? `${trace.relaxation} ms` : "—"} />
        </div>
        {trace && trace.peakForce === 0 && (
          <p className="mt-3 rounded-md bg-[#fbe8df] px-3 py-2 text-[11px] text-[#8b4d2c]">
            Subthreshold stimulus: no measurable contraction.
          </p>
        )}
        {trace && getStimulusPhase(trace.voltage, trace.mode) === "maximal" && (
          <p className="mt-3 rounded-md bg-[#e1f1eb] px-3 py-2 text-[11px] text-[#236653]">
            Maximal response: additional voltage does not increase twitch force.
          </p>
        )}
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border pb-2">
      <p className="text-[10px] text-muted">{label}</p>
      <p className="mt-1 font-accent text-sm font-semibold">{value}</p>
    </div>
  );
}
