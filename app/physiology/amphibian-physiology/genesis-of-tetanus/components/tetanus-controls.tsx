import {
  describeTetanusPattern,
  getTetanusPattern,
} from "../tetanus-model";

const PRESETS = [
  { value: 5, title: "Treppe", range: "5–10 Hz" },
  { value: 15, title: "Clonus", range: "15–20 Hz" },
  { value: 30, title: "Incomplete", range: "30 Hz" },
  { value: 40, title: "Complete", range: "40+ Hz" },
];

export default function TetanusControls({
  frequency,
  running,
  hasRecording,
  onFrequencyChange,
  onStart,
  onStop,
  onReset,
}: {
  frequency: number;
  running: boolean;
  hasRecording: boolean;
  onFrequencyChange: (frequency: number) => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}) {
  const pattern = getTetanusPattern(frequency);

  return (
    <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[.13em] text-[#77c8bd]">
            INTERRUPTER SETTINGS
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white/75">
            Stimulation frequency
          </h2>
        </div>
        <strong className="font-accent text-xl text-[#52d6c5]">
          {frequency} Hz
        </strong>
      </div>
      <input
        type="range"
        min="5"
        max="40"
        step="5"
        value={frequency}
        disabled={running}
        onChange={(event) => onFrequencyChange(Number(event.target.value))}
        className="mt-4 w-full cursor-pointer accent-[#20b8aa] disabled:cursor-not-allowed disabled:opacity-45"
        aria-label="Stimulation frequency"
      />
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {PRESETS.map((preset) => {
          const active = getTetanusPattern(preset.value) === pattern;
          return (
            <button
              key={preset.title}
              type="button"
              disabled={running}
              onClick={() => onFrequencyChange(preset.value)}
              className={`cursor-pointer rounded-md border px-1.5 py-2 text-center transition disabled:cursor-not-allowed ${
                active
                  ? "border-[#2dbbab]/55 bg-[#1b8f85]/20 text-[#66d9cc]"
                  : "border-white/8 bg-white/[.035] text-white/35 hover:text-white/70"
              }`}
            >
              <span className="block text-[10px] font-semibold">{preset.title}</span>
              <span className="mt-0.5 block text-[8px] opacity-65">{preset.range}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-md border border-white/8 bg-black/10 px-3 py-2.5">
        <p className="text-xs font-semibold text-white/78">{pattern}</p>
        <p className="mt-1 text-[10px] leading-4 text-white/45">
          {describeTetanusPattern(pattern)}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={running ? onStop : onStart}
          className={`cursor-pointer rounded-md px-4 py-3 text-sm font-semibold text-white transition active:translate-y-px ${
            running
              ? "bg-[#9c4d49] hover:bg-[#ad5752]"
              : "bg-[#159d91] shadow-[0_8px_24px_rgba(21,157,145,.22)] hover:bg-[#18afa2]"
          }`}
        >
          {running ? "Stop stimulation" : "Start stimulation"}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasRecording}
          className="cursor-pointer rounded-md border border-white/12 bg-white/[.06] px-5 py-3 text-xs font-semibold text-white/65 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
