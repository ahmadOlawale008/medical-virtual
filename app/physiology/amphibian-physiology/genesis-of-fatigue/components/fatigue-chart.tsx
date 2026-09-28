"use client";

import { useState, type PointerEvent } from "react";
import { forceAtTime } from "../../simple-muscle-twitch/twitch-model";
import {
  FATIGUE_MAX_FORCE,
  FATIGUE_PLAYBACK_MS,
  FATIGUE_WINDOW_MS,
  fatigueStage,
  type FatigueTrace,
} from "../fatigue-model";

const WIDTH = 520;
const HEIGHT = 310;
const PADDING = { left: 50, right: 18, top: 20, bottom: 36 };

export default function FatigueChart({
  recordings,
  elapsedMs,
}: {
  recordings: FatigueTrace[];
  elapsedMs: number;
}) {
  const [cursorTime, setCursorTime] = useState<number | null>(null);
  const latest = recordings.at(-1) ?? null;
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const x = (time: number) =>
    PADDING.left + (time / FATIGUE_WINDOW_MS) * plotWidth;
  const y = (force: number) =>
    PADDING.top + plotHeight - ((force + 3) / (FATIGUE_MAX_FORCE + 3)) * plotHeight;
  const visibleRecordingTime = Math.min(
    FATIGUE_WINDOW_MS,
    (elapsedMs / FATIGUE_PLAYBACK_MS) * FATIGUE_WINDOW_MS,
  );

  function pathFor(trace: FatigueTrace, isLatest: boolean) {
    const samples = isLatest
      ? trace.samples?.filter(
          (sample) => sample.time <= visibleRecordingTime,
        )
      : trace.samples;
    return samples?.map(
      (sample, index) =>
        `${index ? "L" : "M"}${x(sample.time).toFixed(1)},${y(sample.force).toFixed(1)}`,
    ).join(" ") ?? "";
  }

  function inspect(event: PointerEvent<SVGSVGElement>) {
    if (!latest) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * WIDTH;
    const clampedX = Math.min(
      WIDTH - PADDING.right,
      Math.max(PADDING.left, pointerX),
    );
    setCursorTime(((clampedX - PADDING.left) / plotWidth) * FATIGUE_WINDOW_MS);
  }

  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[.13em] text-white/40">
            OSCILLOSCOPE
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white/80">
            Repeated twitch force
          </h2>
        </div>
        <div className="text-right font-accent text-[10px] leading-4 text-[#50d99c]">
          <p>CH1: {latest?.voltage.toFixed(1) ?? "—"} V</p>
          <p>TIME: 50 ms/div</p>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full touch-none cursor-crosshair rounded-md border border-white/15 bg-[#020806]"
        role="img"
        aria-label="Repeated muscle contractions showing progressive fatigue"
        onPointerMove={inspect}
        onPointerDown={inspect}
        onPointerLeave={() => setCursorTime(null)}
      >
        <defs>
          <pattern id="fatigue-small-grid" width={plotWidth / 50} height={plotHeight / 30} patternUnits="userSpaceOnUse">
            <path d={`M ${plotWidth / 50} 0 L 0 0 0 ${plotHeight / 30}`} fill="none" stroke="#163023" strokeWidth="0.6" />
          </pattern>
          <pattern id="fatigue-grid" width={plotWidth / 10} height={plotHeight / 6} patternUnits="userSpaceOnUse">
            <rect width={plotWidth / 10} height={plotHeight / 6} fill="url(#fatigue-small-grid)" />
            <path d={`M ${plotWidth / 10} 0 L 0 0 0 ${plotHeight / 6}`} fill="none" stroke="#214430" />
          </pattern>
        </defs>
        <rect x={PADDING.left} y={PADDING.top} width={plotWidth} height={plotHeight} fill="url(#fatigue-grid)" />
        {[-3, 0, 5, 12].map((force) => (
          <g key={force}>
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y(force)} y2={y(force)} stroke="#315244" strokeDasharray="4 5" />
            <text x={PADDING.left - 8} y={y(force) + 4} textAnchor="end" fill="#729084" fontSize="9">{force}</text>
          </g>
        ))}
        <line x1={x(20)} x2={x(20)} y1={PADDING.top} y2={PADDING.top + plotHeight} stroke="#eb5656" strokeDasharray="4 4" />
        <text x={x(20) + 5} y={PADDING.top + 12} fill="#eb5656" fontSize="9">Stim</text>
        <text x="10" y="15" fill="#729084" fontSize="9">Force (g)</text>
        <text x={WIDTH - 16} y={HEIGHT - 8} textAnchor="end" fill="#729084" fontSize="9">Time (ms)</text>
        {recordings.slice(0, -1).map((trace) => (
          <path
            key={trace.id}
            d={pathFor(trace, false)}
            fill="none"
            stroke="#a9b2bb"
            strokeWidth="1.35"
            strokeLinecap="round"
            opacity="0.42"
          />
        ))}
        {latest && (
          <path
            d={pathFor(latest, true)}
            fill="none"
            stroke="#42e493"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {recordings.length > 0 && recordings.length <= 5 && (
          <text x={WIDTH - 22} y="42" textAnchor="end" fill="#9eabb7" fontSize="11">
            Beneficial effect
          </text>
        )}
        {recordings.length >= 18 && (
          <text x={WIDTH - 22} y={y(1.3)} textAnchor="end" fill="#9eabb7" fontSize="11">
            Contraction remainder
          </text>
        )}
        {cursorTime !== null && latest && (
          <g className="pointer-events-none">
            <line x1={x(cursorTime)} x2={x(cursorTime)} y1={PADDING.top} y2={PADDING.top + plotHeight} stroke="#f2f5f3" />
            <circle cx={x(cursorTime)} cy={y(forceAtTime(cursorTime, latest))} r="3.5" fill="#42e493" stroke="white" />
            <rect x={Math.min(x(cursorTime) + 8, 370)} y="48" width="132" height="42" rx="4" fill="#111a2c" stroke="#40506b" />
            <text x={Math.min(x(cursorTime) + 17, 379)} y="65" fill="#c7d0df" fontSize="10">{cursorTime.toFixed(0)} ms</text>
            <text x={Math.min(x(cursorTime) + 17, 379)} y="82" fill="#42e493" fontSize="10">Force {forceAtTime(cursorTime, latest).toFixed(2)} g</text>
          </g>
        )}
      </svg>
      <p className="mt-2 text-[10px] text-white/42">
        {fatigueStage(recordings.length)}
      </p>
    </section>
  );
}
