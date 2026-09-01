import type { ReactNode } from "react";
import { SQUARES, calculateTlc, type SquareId } from "../model";

export default function CountPanel({
  squareCounts,
  completed,
  activeSquare,
  onSelectSquare,
  onCompleteSquare,
  onReset,
  stageControls,
}: {
  squareCounts: Record<SquareId, number>;
  completed: Set<SquareId>;
  activeSquare: SquareId;
  onSelectSquare: (square: SquareId) => void;
  onCompleteSquare: () => void;
  onReset: () => void;
  stageControls: ReactNode;
}) {
  const total = Object.values(squareCounts).reduce((sum, count) => sum + count, 0);
  const tlc = calculateTlc(total);

  return (
    <>
      <section className="rounded-lg border border-white/10 bg-black/20 p-4">
        <p className="text-[10px] font-semibold tracking-[.12em] text-white/45">COUNTING RULE</p>
        <h2 className="mt-2 text-sm font-semibold text-white">Count the four corner W squares</h2>
        <div className="mt-3 space-y-2 text-xs leading-5 text-white/60">
          <p><span className="font-semibold text-[#79c8bc]">Include</span> cells touching the top and left borders.</p>
          <p><span className="font-semibold text-[#efa06f]">Exclude</span> cells touching the bottom and right borders.</p>
          <p>Select each purple leukocyte once. A green ring confirms the tally.</p>
        </div>
      </section>

      {stageControls}

      <section className="rounded-lg border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold tracking-[.12em] text-white/45">TALLY</p>
          <span className="text-[11px] text-white/45">{completed.size}/4 complete</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(Object.keys(SQUARES) as SquareId[]).map((square) => (
            <button
              key={square}
              type="button"
              onClick={() => onSelectSquare(square)}
              className={`cursor-pointer rounded-md border px-3 py-2.5 text-left transition ${
                activeSquare === square
                  ? "border-secondary bg-secondary text-[#132b29]"
                  : "border-white/12 bg-white/5 text-white hover:border-white/30"
              }`}
            >
              <span className="flex items-center justify-between text-xs font-semibold">
                {square}
                <span className="font-accent text-sm">{squareCounts[square]}</span>
              </span>
              <span className={`mt-1 block text-[10px] ${activeSquare === square ? "text-[#132b29]/70" : "text-white/40"}`}>
                {completed.has(square) ? "Complete" : SQUARES[square].label}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onCompleteSquare}
          className="mt-3 w-full cursor-pointer rounded-md bg-white px-3 py-2.5 text-xs font-semibold text-foreground transition hover:bg-primary-soft"
        >
          {completed.has(activeSquare) ? "Square marked complete" : `Finish ${activeSquare} and continue`}
        </button>
      </section>

      <section className="rounded-lg bg-[#f6f7f4] p-4 text-foreground">
        <p className="text-[10px] font-semibold tracking-[.12em] text-primary">LIVE RESULT</p>
        <div className="mt-3 flex items-end justify-between gap-4 border-b border-border pb-3">
          <span className="text-xs text-muted">Cells counted</span>
          <strong className="font-accent text-xl">{total}</strong>
        </div>
        <div className="mt-3 flex items-end justify-between gap-4">
          <span className="text-xs text-muted">Estimated TLC</span>
          <strong className="font-accent text-xl">{tlc.toLocaleString()} <small className="text-xs font-normal">cells/µL</small></strong>
        </div>
        <p className="mt-3 rounded-md bg-primary-soft px-3 py-2 text-[11px] leading-4 text-muted">
          N × 20 dilution × 10 depth ÷ 4 mm² = N × 50
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
