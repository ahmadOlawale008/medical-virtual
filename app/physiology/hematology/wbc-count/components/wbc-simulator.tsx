"use client";

import { useMemo, useState } from "react";
import CountPanel from "./count-panel";
import MicroscopeCanvas from "./microscope-canvas";
import StageControls from "./stage-controls";
import StagePosition from "./stage-position";
import { getStageCenter, SQUARES, type Objective, type SquareId } from "../model";

const OBJECTIVES: Objective[] = [4, 10, 40, 100];
const SQUARE_ORDER = Object.keys(SQUARES) as SquareId[];

export default function WbcSimulator() {
  const [objective, setObjective] = useState<Objective>(4);
  const [activeSquare, setActiveSquare] = useState<SquareId>("W1");
  const [stage, setStage] = useState({ x: -0.85, y: -0.85 });
  const [countedCells, setCountedCells] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<SquareId>>(new Set());

  const squareCounts = useMemo(() => {
    const counts: Record<SquareId, number> = { W1: 0, W2: 0, W3: 0, W4: 0 };
    for (const cellId of countedCells) {
      const square = cellId.split("-")[0] as SquareId;
      counts[square] += 1;
    }
    return counts;
  }, [countedCells]);

  function selectSquare(square: SquareId) {
    setActiveSquare(square);
    setStage({ x: 0, y: 0 });
    if (objective === 4) setObjective(10);
  }

  function moveStage(direction: "up" | "down" | "left" | "right") {
    const increment = objective >= 40 ? 0.035 : 0.08;
    panStage(
      direction === "right" ? increment : direction === "left" ? -increment : 0,
      direction === "down" ? increment : direction === "up" ? -increment : 0,
    );
  }

  function panStage(deltaX: number, deltaY: number) {
    setStage((position) => clampStage(
      { x: position.x + deltaX, y: position.y + deltaY },
      objective,
      activeSquare,
    ));
  }

  function changeObjective(nextObjective: Objective) {
    const currentCenter = getStageCenter(objective, activeSquare, stage);
    const nextBase = nextObjective === 4 ? { x: 1.5, y: 1.5 } : {
      x: SQUARES[activeSquare].center[0],
      y: SQUARES[activeSquare].center[1],
    };
    setStage(clampStage(
      { x: currentCenter.x - nextBase.x, y: currentCenter.y - nextBase.y },
      nextObjective,
      activeSquare,
    ));
    setObjective(nextObjective);
  }

  function toggleCell(cellId: string) {
    setCountedCells((current) => {
      const next = new Set(current);
      if (next.has(cellId)) next.delete(cellId);
      else next.add(cellId);
      return next;
    });
  }

  function completeSquare() {
    setCompleted((current) => new Set(current).add(activeSquare));
    const nextSquare = SQUARE_ORDER[(SQUARE_ORDER.indexOf(activeSquare) + 1) % SQUARE_ORDER.length];
    setActiveSquare(nextSquare);
    setStage({ x: 0, y: 0 });
  }

  function reset() {
    setCountedCells(new Set());
    setCompleted(new Set());
    setActiveSquare("W1");
    setObjective(4);
    setStage({ x: -0.85, y: -0.85 });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-[#0c1c25] shadow-[0_22px_70px_rgba(2,12,14,.24)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2" aria-label="Microscope objective">
          {OBJECTIVES.map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => changeObjective(value)}
              className={`h-10 min-w-12 cursor-pointer rounded-full border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                objective === value
                  ? "border-secondary bg-secondary text-[#132b29] shadow-[0_0_0_3px_rgba(216,120,61,.18)]"
                  : "border-white/15 bg-white/5 text-white/65 hover:border-white/35 hover:text-white"
              }`}
              aria-pressed={objective === value}
            >
              {value}×
            </button>
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold tracking-[.12em] text-white/40">CURRENT FIELD</p>
          <p className="mt-1 text-xs text-white/75">{objective === 4 ? "Chamber overview" : `${activeSquare} · ${SQUARES[activeSquare].label}`}</p>
        </div>
      </div>

      <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative flex min-h-[390px] min-w-0 items-center justify-center overflow-hidden bg-[#020506] p-3 sm:min-h-[560px] sm:p-5">
          <div className="w-full min-w-0 max-w-[760px] overflow-hidden max-sm:w-[calc(100vw-48px)] max-sm:max-w-[calc(100vw-48px)]">
            <MicroscopeCanvas
              objective={objective}
              activeSquare={activeSquare}
              stage={stage}
              countedCells={countedCells}
              onToggleCell={toggleCell}
              onPan={panStage}
            />
          </div>
          <div className="pointer-events-none absolute bottom-5 left-5 rounded-md border border-white/10 bg-black/65 px-3 py-2 text-[10px] leading-4 text-white/60 backdrop-blur-sm">
            Purple = leukocyte<br />Green ring = counted
          </div>
          <StagePosition
            objective={objective}
            activeSquare={activeSquare}
            stage={stage}
          />
          {objective === 100 && (
            <div className="pointer-events-none absolute right-5 top-5 max-w-44 rounded-md border border-secondary/50 bg-black/70 px-3 py-2 text-[10px] leading-4 text-white/70">
              100× oil is useful for morphology, not the routine TLC tally.
            </div>
          )}
        </div>

        <aside className="grid content-start gap-3 border-t border-white/10 bg-[#112731] p-4 xl:border-l xl:border-t-0">
          <CountPanel
            squareCounts={squareCounts}
            completed={completed}
            activeSquare={activeSquare}
            onSelectSquare={selectSquare}
            onCompleteSquare={completeSquare}
            onReset={reset}
            stageControls={(
              <StageControls
                activeSquare={activeSquare}
                onMove={moveStage}
                onCenter={() => setStage({ x: 0, y: 0 })}
              />
            )}
          />
        </aside>
      </div>
    </div>
  );
}

function clampStage(
  next: { x: number; y: number },
  objective: Objective,
  activeSquare: SquareId,
) {
  const base = objective === 4 ? { x: 1.5, y: 1.5 } : {
    x: SQUARES[activeSquare].center[0],
    y: SQUARES[activeSquare].center[1],
  };
  const minimum = -0.35;
  const maximum = 3.35;

  return {
    x: Math.max(minimum - base.x, Math.min(maximum - base.x, next.x)),
    y: Math.max(minimum - base.y, Math.min(maximum - base.y, next.y)),
  };
}
