import { CELL_TYPES, type CellType } from "../model";

export default function CellCounter({
  counts,
  hasSelection,
  onClassify,
  onUndo,
  onMove,
  onResetStage,
  onReset,
}: {
  counts: Record<CellType, number>;
  hasSelection: boolean;
  onClassify: (type: CellType) => void;
  onUndo: () => void;
  onMove: (direction: "up" | "down" | "left" | "right") => void;
  onResetStage: () => void;
  onReset: () => void;
}) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const complete = total === 100;

  return (
    <>
      <section className="rounded-lg border border-white/10 bg-black/20 p-4" aria-live="polite">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[.12em] text-white/45">CELL COUNTER</p>
            <h2 className="mt-1 text-sm font-semibold text-white">Differential tally</h2>
          </div>
          <strong className="font-accent text-xl text-[#79c8bc]">{total} / 100</strong>
        </div>

        <p className={`mt-3 rounded-md px-3 py-2 text-[11px] leading-4 ${
          hasSelection
            ? "bg-secondary/20 text-[#f3b28b]"
            : "bg-white/5 text-white/45"
        }`}>
          {complete
            ? "Differential complete. Review the percentages below."
            : hasSelection
              ? "Cell selected — record its leukocyte type below."
              : "Identify a cell in the smear, then press its leukocyte counter."}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {CELL_TYPES.map((type) => (
            <button
              type="button"
              key={type}
              disabled={complete}
              onClick={() => onClassify(type)}
              className="flex min-h-11 cursor-pointer items-center justify-between rounded-md border border-white/12 bg-white/7 px-3 text-left text-[11px] text-white transition hover:border-secondary hover:bg-secondary/15 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span>{type}</span>
              <span className="rounded bg-black/25 px-2 py-1 font-accent text-xs text-[#79c8bc]">{counts[type]}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={onUndo} disabled={total === 0} className="cursor-pointer text-[11px] text-white/55 hover:text-white disabled:cursor-not-allowed disabled:opacity-35">Undo last</button>
          <button type="button" onClick={onReset} className="cursor-pointer text-[11px] text-white/55 hover:text-white">Reset count</button>
        </div>
      </section>

      <StageControls onMove={onMove} onCenter={onResetStage} />

      <section className="rounded-lg bg-[#f6f7f4] p-4 text-foreground">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-semibold tracking-[.12em] text-primary">DIFFERENTIAL</p>
          <span className="text-[10px] text-muted">Count · percentage</span>
        </div>
        <div className="mt-2 divide-y divide-border">
          {CELL_TYPES.map((type) => (
            <div key={type} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-xs text-muted">{type}</span>
              <strong className="font-accent text-sm">{counts[type]} · {total ? Math.round((counts[type] / total) * 100) : 0}%</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function StageControls({
  onMove,
  onCenter,
}: {
  onMove: (direction: "up" | "down" | "left" | "right") => void;
  onCenter: () => void;
}) {
  const buttonClass = "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/7 text-base text-white transition hover:border-primary hover:bg-primary/25";
  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[.12em] text-white/45">MECHANICAL STAGE</p>
          <p className="mt-1 text-sm font-semibold text-white">Drag or use fine controls</p>
        </div>
        <button type="button" onClick={onCenter} className="cursor-pointer text-[10px] text-white/50 hover:text-white">Center</button>
      </div>
      <div className="mx-auto mt-4 grid w-fit grid-cols-3 gap-2">
        <span />
        <button type="button" className={buttonClass} onClick={() => onMove("up")} aria-label="Move stage up">↑</button>
        <span />
        <button type="button" className={buttonClass} onClick={() => onMove("left")} aria-label="Move stage left">←</button>
        <button type="button" className={buttonClass} onClick={onCenter} aria-label="Center stage">•</button>
        <button type="button" className={buttonClass} onClick={() => onMove("right")} aria-label="Move stage right">→</button>
        <span />
        <button type="button" className={buttonClass} onClick={() => onMove("down")} aria-label="Move stage down">↓</button>
        <span />
      </div>
    </section>
  );
}
