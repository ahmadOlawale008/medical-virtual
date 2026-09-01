import type { ReactNode } from "react";
import { REGIONS, calculateRbc, type RegionId } from "../model";

export default function RbcControls({
  activeRegion,
  regionCounts,
  completed,
  onSelectRegion,
  onComplete,
  onMove,
  onCenter,
  onReset,
}: {
  activeRegion: RegionId;
  regionCounts: Record<RegionId, number>;
  completed: Set<RegionId>;
  onSelectRegion: (region: RegionId) => void;
  onComplete: () => void;
  onMove: (direction: "up" | "down" | "left" | "right") => void;
  onCenter: () => void;
  onReset: () => void;
}) {
  const total = Object.values(regionCounts).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <Panel eyebrow="COUNTING RULE">
        <h2 className="text-sm font-semibold text-white">Count the center RBC square</h2>
        <div className="mt-3 space-y-2 text-xs leading-5 text-white/60">
          <p>The center contains <strong className="text-white">25 large squares</strong>, each divided into 16 small squares.</p>
          <p>Count the four corner regions and the middle region: R1–R5.</p>
          <p><span className="text-[#79c8bc]">Include top and left</span>; <span className="text-[#efa06f]">exclude bottom and right</span>.</p>
        </div>
      </Panel>

      <StageControls activeRegion={activeRegion} onMove={onMove} onCenter={onCenter} />

      <Panel eyebrow="COUNTING REGIONS" side={`${completed.size}/5 complete`}>
        <div className="grid grid-cols-5 gap-1.5">
          {(Object.keys(REGIONS) as RegionId[]).map((region) => (
            <button
              type="button"
              key={region}
              onClick={() => onSelectRegion(region)}
              className={`cursor-pointer rounded-md border py-2 text-center transition ${
                activeRegion === region
                  ? "border-secondary bg-secondary text-[#132b29]"
                  : "border-white/12 bg-white/5 text-white hover:border-white/30"
              }`}
              aria-label={`${REGIONS[region].label}, ${regionCounts[region]} cells counted`}
            >
              <span className="block text-[10px] font-semibold">{region}</span>
              <span className="mt-1 block font-accent text-sm">{regionCounts[region]}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="mt-3 w-full cursor-pointer rounded-md bg-white px-3 py-2.5 text-xs font-semibold text-foreground transition hover:bg-primary-soft"
        >
          Finish {activeRegion} and continue
        </button>
      </Panel>

      <section className="rounded-lg bg-[#f6f7f4] p-4 text-foreground" aria-live="polite">
        <p className="text-[10px] font-semibold tracking-[.12em] text-primary">LIVE RESULT</p>
        <ResultRow label="Cells counted" value={total.toLocaleString()} />
        <ResultRow label="Estimated RBC count" value={`${calculateRbc(total).toLocaleString()} cells/µL`} />
        <p className="mt-3 rounded-md bg-primary-soft px-3 py-2 text-[11px] leading-4 text-muted">
          N × 200 dilution × 10 depth ÷ 0.2 mm² = N × 10,000
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 cursor-pointer text-[11px] font-semibold text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          Reset all counts
        </button>
      </section>
    </>
  );
}

function StageControls({
  activeRegion,
  onMove,
  onCenter,
}: {
  activeRegion: RegionId;
  onMove: (direction: "up" | "down" | "left" | "right") => void;
  onCenter: () => void;
}) {
  const buttonClass = "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/7 text-base text-white transition hover:border-primary hover:bg-primary/25";
  return (
    <Panel eyebrow="MECHANICAL STAGE" side={activeRegion}>
      <p className="text-sm font-semibold text-white">Drag the field or use fine controls</p>
      <div className="mx-auto mt-4 grid w-fit grid-cols-3 gap-2">
        <span />
        <button type="button" className={buttonClass} onClick={() => onMove("up")} aria-label="Move stage up">↑</button>
        <span />
        <button type="button" className={buttonClass} onClick={() => onMove("left")} aria-label="Move stage left">←</button>
        <button type="button" className={buttonClass} onClick={onCenter} aria-label="Center active region">•</button>
        <button type="button" className={buttonClass} onClick={() => onMove("right")} aria-label="Move stage right">→</button>
        <span />
        <button type="button" className={buttonClass} onClick={() => onMove("down")} aria-label="Move stage down">↓</button>
        <span />
      </div>
    </Panel>
  );
}

function Panel({
  eyebrow,
  side,
  children,
}: {
  eyebrow: string;
  side?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold tracking-[.12em] text-white/45">{eyebrow}</p>
        {side && <span className="text-[10px] text-white/45">{side}</span>}
      </div>
      {children}
    </section>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 flex items-end justify-between gap-4 border-b border-border pb-3 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <strong className="text-right font-accent text-base">{value}</strong>
    </div>
  );
}
