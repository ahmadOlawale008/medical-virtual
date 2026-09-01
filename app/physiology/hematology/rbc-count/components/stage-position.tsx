import { OBJECTIVE_ZOOM, type Objective } from "../model";

export default function StagePosition({
  objective,
  stage,
}: {
  objective: Objective;
  stage: { x: number; y: number };
}) {
  const fieldSize = 684 / (190 * OBJECTIVE_ZOOM[objective]);
  const markerSize = Math.max(8, Math.min(52, (fieldSize / 3) * 72));
  const left = Math.max(0, Math.min(100, ((1.5 + stage.x) / 3) * 100));
  const top = Math.max(0, Math.min(100, ((1.5 + stage.y) / 3) * 100));
  return (
    <div className="pointer-events-none absolute bottom-5 right-5 rounded-md border border-white/15 bg-[#0c1c25]/90 p-2 shadow-lg backdrop-blur-sm">
      <div className="medical-stage-map relative h-[72px] w-[72px] overflow-hidden border border-white/25 bg-[#dfe5e3]">
        <span
          className="absolute border-2 border-secondary shadow-[0_0_5px_rgba(216,120,61,.9)]"
          style={{
            width: markerSize,
            height: markerSize,
            left: `${left}%`,
            top: `${top}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <p className="mt-1 text-center text-[9px] text-white/50">Stage position</p>
    </div>
  );
}
