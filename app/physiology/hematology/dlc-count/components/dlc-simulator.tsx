"use client";

import { useState } from "react";
import CellCounter from "./cell-counter";
import DlcCanvas from "./dlc-canvas";
import StagePosition from "./stage-position";
import { emptyCounts, type CellType, type Objective } from "../model";

const OBJECTIVES: Objective[] = [4, 10, 40, 100];
type HistoryEntry = { cellId: string; classifiedAs: CellType };

export default function DlcSimulator() {
  const [objective, setObjective] = useState<Objective>(4);
  const [stage, setStage] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<{ id: string; actualType: CellType } | null>(null);
  const [counts, setCounts] = useState(emptyCounts);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const classifiedCells = new Set(history.map((entry) => entry.cellId));
  const total = history.length;

  function panStage(deltaX: number, deltaY: number) {
    setStage((current) => ({
      x: Math.max(-1.85, Math.min(1.85, current.x + deltaX)),
      y: Math.max(-1.85, Math.min(1.85, current.y + deltaY)),
    }));
  }

  function classify(type: CellType) {
    if (total >= 100) return;
    const cellId = selected?.id ?? `manual-${total + 1}`;
    setCounts((current) => ({ ...current, [type]: current[type] + 1 }));
    setHistory((current) => [...current, { cellId, classifiedAs: type }]);
    setSelected(null);
  }

  function undo() {
    const last = history.at(-1);
    if (!last) return;
    setCounts((current) => ({
      ...current,
      [last.classifiedAs]: Math.max(0, current[last.classifiedAs] - 1),
    }));
    setHistory((current) => current.slice(0, -1));
  }

  function reset() {
    setCounts(emptyCounts());
    setHistory([]);
    setSelected(null);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-[#0c1c25] shadow-[0_22px_70px_rgba(2,12,14,.24)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2" aria-label="Microscope objective">
          {OBJECTIVES.map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setObjective(value)}
              className={`h-10 min-w-12 cursor-pointer rounded-full border px-3 text-xs font-semibold transition ${
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
          <p className="text-[10px] font-semibold tracking-[.12em] text-white/40">SMEAR PROGRESS</p>
          <p className="mt-1 text-xs text-white/75">{total} of 100 leukocytes classified</p>
        </div>
      </div>

      <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative flex min-h-[390px] min-w-0 items-center justify-center overflow-hidden bg-[#020506] p-3 sm:min-h-[560px] sm:p-5">
          <div className="w-full min-w-0 max-w-[760px] overflow-hidden max-sm:w-[calc(100vw-48px)] max-sm:max-w-[calc(100vw-48px)]">
            <DlcCanvas
              objective={objective}
              stage={stage}
              selectedCell={selected?.id ?? null}
              classifiedCells={classifiedCells}
              onPan={panStage}
              onSelectCell={(id, actualType) => setSelected({ id, actualType })}
            />
          </div>
          <div className="pointer-events-none absolute bottom-5 left-5 rounded-md border border-white/10 bg-black/65 px-3 py-2 text-[10px] leading-4 text-white/60 backdrop-blur-sm">
            Drag to scan the smear<br />Select leukocytes at 40× or 100×
          </div>
          <StagePosition objective={objective} stage={stage} />
        </div>

        <aside className="grid content-start gap-3 border-t border-white/10 bg-[#112731] p-4 xl:border-l xl:border-t-0">
          <CellCounter
            counts={counts}
            hasSelection={Boolean(selected)}
            onClassify={classify}
            onUndo={undo}
            onMove={(direction) => panStage(
              direction === "right" ? 0.05 : direction === "left" ? -0.05 : 0,
              direction === "down" ? 0.05 : direction === "up" ? -0.05 : 0,
            )}
            onResetStage={() => setStage({ x: 0, y: 0 })}
            onReset={reset}
          />
        </aside>
      </div>
    </div>
  );
}
