"use client";

import { useState, type PointerEvent } from "react";
import {
  singleTwitchForce,
  twoStimuliForce,
  TWO_STIMULI_MAX_FORCE,
  TWO_STIMULI_WINDOW_MS,
  type TwoStimuliTrace,
} from "../two-stimuli-model";

const WIDTH = 520;
const HEIGHT = 270;
const PADDING = { left: 45, right: 17, top: 22, bottom: 34 };

export default function TwoStimuliChart({
  traces,
}: {
  traces: TwoStimuliTrace[];
}) {
  const [cursorTime, setCursorTime] = useState<number | null>(null);
  const latest = traces.at(-1) ?? null;
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const x = (time: number) => PADDING.left + (time / TWO_STIMULI_WINDOW_MS) * plotWidth;
  const y = (force: number) => PADDING.top + plotHeight - (force / TWO_STIMULI_MAX_FORCE) * plotHeight;

  function inspect(event: PointerEvent<SVGSVGElement>) {
    if (!latest) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * WIDTH;
    const clampedX = Math.min(WIDTH - PADDING.right, Math.max(PADDING.left, pointerX));
    setCursorTime(((clampedX - PADDING.left) / plotWidth) * TWO_STIMULI_WINDOW_MS);
  }

  const basePath = Array.from({ length: 151 }, (_, index) => {
    const time = index * 2;
    return `${index ? "L" : "M"}${x(time).toFixed(1)},${y(singleTwitchForce(time)).toFixed(1)}`;
  }).join(" ");

  return (
    <section className="rounded-lg border border-white/10 bg-[#020817] p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[.13em] text-white/40">TWO-STIMULUS RECORDING</p>
          <h2 className="mt-1 text-sm font-semibold text-white/80">Force response</h2>
        </div>
        <p className="font-accent text-[10px] text-[#52d6c5]">{latest ? `S₁ → S₂: ${latest.interval} ms` : "Ready"}</p>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full touch-none cursor-crosshair"
        role="img"
        aria-label="Interactive recording of two successive stimuli"
        onPointerMove={inspect}
        onPointerDown={inspect}
        onPointerLeave={() => setCursorTime(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <line key={`h-${fraction}`} x1={PADDING.left} x2={WIDTH - PADDING.right} y1={PADDING.top + fraction * plotHeight} y2={PADDING.top + fraction * plotHeight} stroke="#25364b" />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <line key={`v-${fraction}`} x1={PADDING.left + fraction * plotWidth} x2={PADDING.left + fraction * plotWidth} y1={PADDING.top} y2={PADDING.top + plotHeight} stroke="#25364b" />
        ))}
        <text x="8" y="16" fill="#7f91a0" fontSize="9">Force (g)</text>
        <text x={WIDTH - 16} y={HEIGHT - 8} textAnchor="end" fill="#7f91a0" fontSize="9">Time (ms)</text>
        {latest && (
          <>
            <path d={basePath} fill="none" stroke="#5f7190" strokeDasharray="5 5" strokeWidth="1.7" />
            {traces.map((trace, index) => {
              const path = Array.from({ length: 151 }, (_, pointIndex) => {
                const time = pointIndex * 2;
                return `${pointIndex ? "L" : "M"}${x(time).toFixed(1)},${y(twoStimuliForce(time, trace.interval)).toFixed(1)}`;
              }).join(" ");
              const color = index === traces.length - 1 ? "#55e394" : "#55a6df";
              return <path key={trace.id} d={path} fill="none" stroke={color} strokeWidth={index === traces.length - 1 ? "3" : "1.8"} opacity={index === traces.length - 1 ? 1 : 0.55} strokeLinecap="round" />;
            })}
            <circle cx={x(0)} cy={y(0)} r="4" fill="#f5c94a" />
            <text x={x(0) - 1} y={y(0) + 18} textAnchor="middle" fill="#f5c94a" fontSize="10">S₁</text>
            <circle cx={x(latest.interval)} cy={y(0)} r="4" fill="#eb83dc" />
            <text x={x(latest.interval)} y={y(0) + 18} textAnchor="middle" fill="#eb83dc" fontSize="10">S₂</text>
          </>
        )}
        {cursorTime !== null && latest && (
          <g className="pointer-events-none">
            <line x1={x(cursorTime)} x2={x(cursorTime)} y1={PADDING.top} y2={PADDING.top + plotHeight} stroke="#edf5f1" />
            <circle cx={x(cursorTime)} cy={y(twoStimuliForce(cursorTime, latest.interval))} r="3.5" fill="#55e394" stroke="white" />
            <rect x={Math.min(x(cursorTime) + 8, 366)} y="30" width="140" height="42" rx="4" fill="#111a2c" stroke="#40506b" />
            <text x={Math.min(x(cursorTime) + 17, 375)} y="47" fill="#c7d0df" fontSize="10">TIME {cursorTime.toFixed(1)} ms</text>
            <text x={Math.min(x(cursorTime) + 17, 375)} y="64" fill="#55e394" fontSize="10">FORCE {twoStimuliForce(cursorTime, latest.interval).toFixed(2)} g</text>
          </g>
        )}
      </svg>
      <p className="mt-2 text-[10px] text-white/38">Dashed trace: response to S₁ alone. Solid trace: summed response to S₁ and S₂.</p>
    </section>
  );
}
