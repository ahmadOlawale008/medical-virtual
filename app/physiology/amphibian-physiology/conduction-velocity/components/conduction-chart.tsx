"use client";

import { forceAtTime } from "../../simple-muscle-twitch/twitch-model";
import {
  CONDUCTION_MAX_FORCE,
  CONDUCTION_PLAYBACK_MS,
  CONDUCTION_WINDOW_MS,
  type ConductionTrace,
} from "../conduction-model";

const WIDTH = 520;
const HEIGHT = 390;
const PADDING = { left: 58, right: 20, top: 50, bottom: 72 };

export default function ConductionChart({
  traces,
  activeTraceId,
  elapsedMs,
  running,
}: {
  traces: ConductionTrace[];
  activeTraceId: number | null;
  elapsedMs: number;
  running: boolean;
}) {
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const baseline = PADDING.top + plotHeight * 0.78;
  const x = (time: number) => PADDING.left + (time / CONDUCTION_WINDOW_MS) * plotWidth;
  const y = (force: number) => baseline - (force / CONDUCTION_MAX_FORCE) * plotHeight * 0.7;
  const visibleTime = Math.min(
    CONDUCTION_WINDOW_MS,
    (elapsedMs / CONDUCTION_PLAYBACK_MS) * CONDUCTION_WINDOW_MS,
  );

  function pathFor(trace: ConductionTrace) {
    const limit = trace.id === activeTraceId && running
      ? visibleTime
      : CONDUCTION_WINDOW_MS;
    return Array.from({ length: 151 }, (_, index) => {
      const time = (index / 150) * CONDUCTION_WINDOW_MS;
      return { time, force: forceAtTime(time, trace) };
    })
      .filter((sample) => sample.time <= limit)
      .map((sample, index) => `${index ? "L" : "M"}${x(sample.time).toFixed(1)},${y(sample.force).toFixed(1)}`)
      .join(" ");
  }

  const muscle = traces.find((trace) => trace.point === "muscle");
  const vertebral = traces.find((trace) => trace.point === "vertebral");

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold tracking-[.08em] text-white/55">KYMOGRAPH RECORD</h2>
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black p-2">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full" role="img" aria-label="Muscle-end and vertebral-end conduction velocity curves">
          <defs>
            <pattern id="conduction-grid" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M 26 0 L 0 0 0 26" fill="none" stroke="#102318" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width={WIDTH} height={HEIGHT} fill="#010704" />
          <rect x={PADDING.left} y={PADDING.top} width={plotWidth} height={plotHeight} fill="url(#conduction-grid)" />
          <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={baseline} y2={baseline} stroke="#377bd8" strokeWidth="1.5" />
          <line x1={x(0)} x2={x(0)} y1={baseline - 9} y2={baseline + 9} stroke="#60a5fa" strokeWidth="2" />
          <text x={x(0)} y={baseline - 16} textAnchor="middle" fill="#9aa8bb" fontSize="10" fontWeight="700">PS</text>

          {traces.map((trace) => (
            <path key={trace.id} d={pathFor(trace)} fill="none" stroke={trace.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          ))}

          {muscle && (
            <>
              <text x={x(52)} y={y(muscle.peakForce) - 18} textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="700">M-curve</text>
              <LatencyArrow startX={x(0)} endX={x(muscle.latency)} y={baseline + 27} baseline={baseline} label="LP₁" color="#93c5fd" />
            </>
          )}
          {vertebral && (
            <>
              <text x={x(82)} y={y(vertebral.peakForce) - 18} textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="700">V-curve</text>
              <LatencyArrow startX={x(0)} endX={x(vertebral.latency)} y={baseline + 51} baseline={baseline} label="LP₂" color="#60a5fa" />
            </>
          )}

          <text x={WIDTH - 20} y="25" textAnchor="end" fill="#4ade80" fontSize="12" fontWeight="700" fontFamily="monospace">CONDUCTION VELOCITY</text>
          <text x={WIDTH - 20} y="40" textAnchor="end" fill="#94a3b8" fontSize="10">PS = Point of stimulus · LP = Latent period</text>
          {running && <text x={WIDTH - 20} y="57" textAnchor="end" fill="#ef6666" fontSize="10" fontFamily="monospace">t = {visibleTime.toFixed(0)} ms</text>}
        </svg>
      </div>
    </section>
  );
}

function LatencyArrow({ startX, endX, y, baseline, label, color }: { startX: number; endX: number; y: number; baseline: number; label: string; color: string }) {
  return (
    <g stroke={color} fill={color}>
      <line x1={startX} x2={endX} y1={y} y2={y} />
      <path d={`M${startX},${y} l5,-4 M${startX},${y} l5,4 M${endX},${y} l-5,-4 M${endX},${y} l-5,4`} fill="none" />
      <line x1={endX} x2={endX} y1={baseline - 8} y2={y + 5} />
      <text x={endX + 5} y={y + 4} stroke="none" fontSize="10">{label}</text>
    </g>
  );
}
