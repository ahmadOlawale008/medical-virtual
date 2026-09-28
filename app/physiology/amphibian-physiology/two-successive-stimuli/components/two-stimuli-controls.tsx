import {
  describeTwoStimuli,
  PERIOD_OPTIONS,
  type StimulusPeriod,
  type TwoStimuliTrace,
} from "../two-stimuli-model";

export default function TwoStimuliControls({
  interval,
  period,
  latestTrace,
  running,
  onIntervalChange,
  onPeriodSelect,
  onStimulate,
  onReset,
}: {
  interval: number;
  period: StimulusPeriod;
  latestTrace: TwoStimuliTrace | null;
  running: boolean;
  onIntervalChange: (interval: number) => void;
  onPeriodSelect: (period: StimulusPeriod) => void;
  onStimulate: () => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-white/80">Stimulus interval</h2>
        <strong className="font-accent text-xl text-[#43cbed]">{interval} ms</strong>
      </div>
      <input
        type="range"
        min="2"
        max="160"
        step="1"
        value={interval}
        disabled={running}
        onChange={(event) => onIntervalChange(Number(event.target.value))}
        className="mt-4 w-full cursor-pointer accent-[#16b3d0] disabled:cursor-not-allowed disabled:opacity-45"
        aria-label="Interval between first and second stimulus"
      />
      <p className="mt-4 text-xs font-semibold text-white/65">S₂ falls during the following period of S₁:</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {PERIOD_OPTIONS.map((option, index) => {
          const active = option.value === period;
          return (
            <button
              key={option.value}
              type="button"
              disabled={running}
              onClick={() => onPeriodSelect(option.value)}
              className={`cursor-pointer rounded-md border px-3 py-2.5 text-left transition disabled:cursor-not-allowed ${active ? "border-[#24bedb] bg-[#1597b7]/15 text-[#8ce9f7]" : "border-white/10 bg-white/[.035] text-white/55 hover:border-white/25 hover:text-white/85"}`}
            >
              <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full border border-current text-[10px] font-semibold">{String.fromCharCode(65 + index)}</span>
              <span className="text-[11px] font-semibold">{option.title}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-md border border-white/8 bg-black/10 px-3 py-2.5">
        <p className="text-xs font-semibold text-white/80">{latestTrace ? latestTrace.period.replace("-", " ") : "Choose an interval"}</p>
        <p className="mt-1 text-[10px] leading-4 text-white/48">{latestTrace ? describeTwoStimuli(latestTrace) : "Set the timing of S₂, then stimulate the preparation."}</p>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button type="button" onClick={onStimulate} disabled={running} className="cursor-pointer rounded-md bg-[#149cbc] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#19afd0] disabled:cursor-not-allowed disabled:opacity-55">{running ? "Recording…" : "▷  Stimulate"}</button>
        <button type="button" onClick={onReset} disabled={!latestTrace} className="cursor-pointer rounded-md border border-white/12 bg-white/[.06] px-5 py-3 text-xs font-semibold text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35">Reset</button>
      </div>
    </section>
  );
}
