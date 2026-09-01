import type { SquareId } from "../model";

type Direction = "up" | "down" | "left" | "right";

export default function StageControls({
  activeSquare,
  onMove,
  onCenter,
}: {
  activeSquare: SquareId;
  onMove: (direction: Direction) => void;
  onCenter: () => void;
}) {
  const buttonClass =
    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/7 text-base text-white transition hover:border-primary hover:bg-primary/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[.12em] text-white/45">MECHANICAL STAGE</p>
          <p className="mt-1 text-sm font-semibold text-white">Fine position · {activeSquare}</p>
        </div>
        <button
          type="button"
          className="cursor-pointer text-[11px] font-semibold text-primary-soft underline-offset-4 hover:underline"
          onClick={onCenter}
        >
          Center
        </button>
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
