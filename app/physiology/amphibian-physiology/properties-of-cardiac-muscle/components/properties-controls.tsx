import { experiments, type CardiacExperiment } from "../cardiac-properties-model";

export default function PropertiesControls({ experiment, drumSpeed, heartRate, soundEnabled, recording, hasRecording, onExperimentChange, onDrumSpeedChange, onToggleSound, onToggleRecording, onReset }: {
  experiment: CardiacExperiment;
  drumSpeed: number;
  heartRate: number;
  soundEnabled: boolean;
  recording: boolean;
  hasRecording: boolean;
  onExperimentChange: (value: CardiacExperiment) => void;
  onDrumSpeedChange: (value: number) => void;
  onToggleSound: () => void;
  onToggleRecording: () => void;
  onReset: () => void;
}) {
  const selected = experiments.find((item) => item.id === experiment) ?? experiments[0];

  return <div className="grid gap-4">
    <section>
      <label htmlFor="cardiac-experiment" className="mb-2 block text-[10px] font-semibold tracking-[.12em] text-white/45">SELECT EXPERIMENT</label>
      <select id="cardiac-experiment" value={experiment} disabled={recording} onChange={(event) => onExperimentChange(event.target.value as CardiacExperiment)} className="w-full cursor-pointer rounded-md border border-white/15 bg-[#19283a] px-3 py-2.5 text-sm text-white outline-none">
        {experiments.map((item) => <option key={item.id} value={item.id}>{item.number}. {item.title}</option>)}
      </select>
    </section>

    <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#31d67b]" /><span className="text-sm text-white/70">Heart rate</span></div>
        <div className="flex items-center gap-3">
          <span className="font-accent text-xl font-semibold text-[#31d67b]">{heartRate} bpm</span>
          <button type="button" onClick={onToggleSound} aria-label={soundEnabled ? "Mute heartbeat" : "Play heartbeat"} className={`cursor-pointer rounded-md border px-2.5 py-2 text-sm ${soundEnabled ? "border-[#ef4b50]/50 bg-[#ef4b50]/15 text-[#ff777b]" : "border-white/10 bg-white/[.05] text-white/45"}`}>{soundEnabled ? "🔊" : "🔇"}</button>
        </div>
      </div>
    </section>

    <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
      <div className="flex items-center justify-between"><label htmlFor="properties-drum-speed" className="text-[10px] font-semibold tracking-[.12em] text-white/45">DRUM SPEED</label><span className="font-accent text-sm text-[#55ddea]">{drumSpeed.toFixed(1)} mm/s</span></div>
      <input id="properties-drum-speed" type="range" min="1" max="10" step="0.5" value={drumSpeed} disabled={experiment === "heart-block" || experiment === "all-or-none"} onChange={(event) => onDrumSpeedChange(Number(event.target.value))} className="mt-3 w-full cursor-pointer accent-[#2dc5d0] disabled:cursor-not-allowed disabled:opacity-50" />
      <div className="mt-1 flex justify-between text-[10px] text-white/35"><span>1 mm/s</span><span>10 mm/s</span></div>
    </section>

    <section className="rounded-lg border border-[#31d67b]/20 bg-[#31d67b]/[.07] p-3 text-xs leading-5 text-white/60">{selected.note}</section>
    <div className="grid grid-cols-[1fr_auto] gap-2">
      <button type="button" onClick={onToggleRecording} className={`cursor-pointer rounded-md px-4 py-3 text-sm font-semibold text-white ${recording ? "bg-[#59636f]" : "bg-[#e52b31] hover:bg-[#f0373d]"}`}>{recording ? "■ Stop recording" : "▷ Start recording"}</button>
      <button type="button" disabled={!hasRecording} onClick={onReset} className="cursor-pointer rounded-md border border-white/12 bg-white/[.06] px-5 text-xs font-semibold text-white/70 disabled:cursor-not-allowed disabled:opacity-35">Reset</button>
    </div>
  </div>;
}
