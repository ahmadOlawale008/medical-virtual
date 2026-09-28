import { loadModeLabel, type LoadMode, type LoadRecording } from "../load-model";

export default function LoadControls({
  load,
  mode,
  latest,
  running,
  onLoadChange,
  onModeChange,
  onStimulate,
  onReset,
}: {
  load: number;
  mode: LoadMode;
  latest: LoadRecording | null;
  running: boolean;
  onLoadChange: (load: number) => void;
  onModeChange: (mode: LoadMode) => void;
  onStimulate: () => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
      <div className="grid grid-cols-2 gap-2 rounded-md bg-black/15 p-1">
        {(["afterloaded", "freeloaded"] as const).map((value) => <button key={value} type="button" disabled={running} onClick={() => onModeChange(value)} className={`cursor-pointer rounded-md px-3 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed ${mode === value ? "bg-[#159d58] text-white" : "text-white/55 hover:bg-white/[.06] hover:text-white"}`}>{loadModeLabel(value)}</button>)}
      </div>
      <div className="mt-5 flex items-center justify-between"><h2 className="text-sm font-semibold text-white/80">⚖ Load (grams)</h2><span className="text-xs text-white/40">Max: 100g</span></div>
      <div className="mt-3 grid grid-cols-[42px_1fr_42px] items-center gap-3">
        <button type="button" aria-label="Decrease load" disabled={running || load <= 0} onClick={() => onLoadChange(Math.max(0, load - 10))} className="cursor-pointer rounded-md border border-white/10 bg-white/[.06] py-2 text-lg text-white/75 disabled:cursor-not-allowed disabled:opacity-35">−</button>
        <input type="range" min="0" max="100" step="10" value={load} disabled={running} onChange={(event) => onLoadChange(Number(event.target.value))} className="w-full cursor-pointer accent-[#3c7af1] disabled:cursor-not-allowed" aria-label="Applied load in grams" />
        <button type="button" aria-label="Increase load" disabled={running || load >= 100} onClick={() => onLoadChange(Math.min(100, load + 10))} className="cursor-pointer rounded-md border border-white/10 bg-white/[.06] py-2 text-lg text-white/75 disabled:cursor-not-allowed disabled:opacity-35">+</button>
      </div>
      <div className="mt-3 flex items-end justify-between"><span className="font-accent text-2xl text-[#5d8dff]">{load}g</span>{latest && <span className="text-right text-[10px] leading-4 text-white/45">Shortening: {latest.shortening.toFixed(2)} mm<br />Work: {latest.work.toFixed(2)} g·mm</span>}</div>
      <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
        <button type="button" disabled={running} onClick={onStimulate} className="cursor-pointer rounded-md bg-[#5144e8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6356f1] disabled:cursor-not-allowed disabled:opacity-55">{running ? "Recording…" : "⌁  Stimulate"}</button>
        <button type="button" disabled={!latest} onClick={onReset} className="cursor-pointer rounded-md border border-white/12 bg-white/[.06] px-5 py-3 text-xs font-semibold text-white/70 disabled:cursor-not-allowed disabled:opacity-35">Reset</button>
      </div>
    </section>
  );
}
