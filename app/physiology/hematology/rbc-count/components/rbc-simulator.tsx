"use client";

import { useMemo, useState } from "react";
import RbcCanvas from "./rbc-canvas";
import RbcControls from "./rbc-controls";
import StagePosition from "./stage-position";
import { REGIONS, type Objective, type RegionId } from "../model";

const OBJECTIVES: Objective[] = [4, 10, 40, 100];
const REGION_ORDER = Object.keys(REGIONS) as RegionId[];

export default function RbcSimulator() {
  const [objective, setObjective] = useState<Objective>(4);
  const [stage, setStage] = useState({ x: 0, y: 0 });
  const [activeRegion, setActiveRegion] = useState<RegionId>("R1");
  const [countedCells, setCountedCells] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<RegionId>>(new Set());

  const regionCounts = useMemo(() => {
    const counts: Record<RegionId, number> = { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0 };
    for (const id of countedCells) {
      const region = id.split(":")[0] as RegionId;
      if (region in counts) counts[region] += 1;
    }
    return counts;
  }, [countedCells]);

  function panStage(deltaX: number, deltaY: number) {
    setStage((current) => ({
      x: Math.max(-1.85, Math.min(1.85, current.x + deltaX)),
      y: Math.max(-1.85, Math.min(1.85, current.y + deltaY)),
    }));
  }

  function changeObjective(next: Objective) {
    setObjective(next);
  }

  function selectRegion(region: RegionId) {
    setActiveRegion(region);
    setObjective(40);
    setStage({
      x: REGIONS[region].center[0] - 1.5,
      y: REGIONS[region].center[1] - 1.5,
    });
  }

  function centerRegion() {
    setStage({
      x: REGIONS[activeRegion].center[0] - 1.5,
      y: REGIONS[activeRegion].center[1] - 1.5,
    });
  }

  function toggleCell(cellId: string) {
    setCountedCells((current) => {
      const next = new Set(current);
      const regionPrefix = `${activeRegion}:`;
      const tallyId = `${regionPrefix}${cellId}`;
      if (next.has(tallyId)) next.delete(tallyId);
      else next.add(tallyId);
      return next;
    });
  }

  function completeRegion() {
    setCompleted((current) => new Set(current).add(activeRegion));
    const next = REGION_ORDER[(REGION_ORDER.indexOf(activeRegion) + 1) % REGION_ORDER.length];
    selectRegion(next);
  }

  function reset() {
    setObjective(4);
    setStage({ x: 0, y: 0 });
    setActiveRegion("R1");
    setCountedCells(new Set());
    setCompleted(new Set());
  }

  const renderedCountedCells = useMemo(
    () => new Set(Array.from(countedCells, (id) => id.slice(id.indexOf(":") + 1))),
    [countedCells],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-[#0c1c25] shadow-[0_22px_70px_rgba(2,12,14,.24)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2" aria-label="Microscope objective">
          {OBJECTIVES.map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => changeObjective(value)}
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
          <p className="text-[10px] font-semibold tracking-[.12em] text-white/40">CURRENT FIELD</p>
          <p className="mt-1 text-xs text-white/75">{objective < 40 ? "Central chamber overview" : `${activeRegion} · ${REGIONS[activeRegion].label}`}</p>
        </div>
      </div>

      <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative flex min-h-[390px] min-w-0 items-center justify-center overflow-hidden bg-[#020506] p-3 sm:min-h-[560px] sm:p-5">
          <div className="w-full min-w-0 max-w-[760px] overflow-hidden max-sm:w-[calc(100vw-48px)] max-sm:max-w-[calc(100vw-48px)]">
            <RbcCanvas
              objective={objective}
              stage={stage}
              activeRegion={activeRegion}
              countedCells={renderedCountedCells}
              onPan={panStage}
              onToggleCell={toggleCell}
            />
          </div>
          <div className="pointer-events-none absolute bottom-5 left-5 rounded-md border border-white/10 bg-black/65 px-3 py-2 text-[10px] leading-4 text-white/60 backdrop-blur-sm">
            Drag to move the chamber<br />Count cells at 40× or 100×
          </div>
          <StagePosition objective={objective} stage={stage} />
        </div>

        <aside className="grid content-start gap-3 border-t border-white/10 bg-[#112731] p-4 xl:border-l xl:border-t-0">
          <RbcControls
            activeRegion={activeRegion}
            regionCounts={regionCounts}
            completed={completed}
            onSelectRegion={selectRegion}
            onComplete={completeRegion}
            onMove={(direction) => panStage(
              direction === "right" ? 0.04 : direction === "left" ? -0.04 : 0,
              direction === "down" ? 0.04 : direction === "up" ? -0.04 : 0,
            )}
            onCenter={centerRegion}
            onReset={reset}
          />
        </aside>
      </div>
    </div>
  );
}
