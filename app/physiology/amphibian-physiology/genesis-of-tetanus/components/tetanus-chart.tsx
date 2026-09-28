"use client";

import { useState, type PointerEvent } from "react";
import { forceAtTime } from "../../simple-muscle-twitch/twitch-model";
import {
  TETANUS_MAX_FORCE,
  TETANUS_WINDOW_MS,
  type TetanusTrace,
} from "../tetanus-model";

const WIDTH = 520;
const HEIGHT = 330;
const PADDING = { left: 48, right: 18, top: 34, bottom: 36 };

export default function TetanusChart({
  trace,
  elapsedMs,
}: {
  trace: TetanusTrace | null;
  elapsedMs: number;
}) {
  const [cursorTime, setCursorTime] = useState<number | null>(null);
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const x = (time: number) =>
    PADDING.left + (time / TETANUS_WINDOW_MS) * plotWidth;
  const y = (force: number) =>
    PADDING.top + plotHeight - (force / TETANUS_MAX_FORCE) * plotHeight;
  const visibleSamples = trace?.samples?.filter(
    (sample) => sample.time <= elapsedMs,
  ) ?? [];
  const path = visibleSamples
    .map(
      (sample, index) =>
        `${index === 0 ? "M" : "L"}${x(sample.time).toFixed(1)},${y(sample.force).toFixed(1)}`,
    )
    .join(" ");

  function inspect(event: PointerEvent<SVGSVGElement>) {
    if (!trace) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * WIDTH;
    const clampedX = Math.min(
      WIDTH - PADDING.right,
      Math.max(PADDING.left, pointerX),
    );
    setCursorTime(((clampedX - PADDING.left) / plotWidth) * TETANUS_WINDOW_MS);
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[.13em] text-white/38">
            OSCILLOSCOPE
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white/75">
            Isometric tension
          </h2>
        </div>
        <div className="text-right font-accent text-[10px] leading-4 text-[#50d99c]">
          <p>FREQ: {trace?.frequency ?? 5} Hz</p>
          <p>TIME: 3 s window</p>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-[#020817] p-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full touch-none cursor-crosshair"
          aria-label="Tetanus force recording"
          role="img"
          onPointerMove={inspect}
          onPointerDown={inspect}
          onPointerLeave={() => setCursorTime(null)}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <line
              key={`h-${fraction}`}
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={PADDING.top + fraction * plotHeight}
              y2={PADDING.top + fraction * plotHeight}
              stroke="#1d3140"
            />
          ))}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((fraction) => (
            <line
              key={`v-${fraction}`}
              x1={PADDING.left + fraction * plotWidth}
              x2={PADDING.left + fraction * plotWidth}
              y1={PADDING.top}
              y2={PADDING.top + plotHeight}
              stroke="#1d3140"
            />
          ))}
          <text x="8" y="22" fill="#7f91a0" fontSize="10">Force (g)</text>
          <text x={WIDTH - 18} y={HEIGHT - 8} textAnchor="end" fill="#7f91a0" fontSize="10">Time (ms)</text>
          {path && (
            <path
              d={path}
              fill="none"
              stroke="#42e493"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="twitch-trace"
            />
          )}
          {cursorTime !== null && trace && (
            <g className="pointer-events-none">
              <line
                x1={x(cursorTime)}
                x2={x(cursorTime)}
                y1={PADDING.top}
                y2={PADDING.top + plotHeight}
                stroke="#eef5f2"
              />
              <circle
                cx={x(cursorTime)}
                cy={y(forceAtTime(cursorTime, trace))}
                r="3.5"
                fill="#42e493"
                stroke="white"
              />
              <rect
                x={Math.min(x(cursorTime) + 8, 368)}
                y="42"
                width="134"
                height="42"
                rx="4"
                fill="#111a2c"
                stroke="#40506b"
              />
              <text x={Math.min(x(cursorTime) + 17, 377)} y="59" fill="#c7d0df" fontSize="10">
                {cursorTime.toFixed(0)} ms
              </text>
              <text x={Math.min(x(cursorTime) + 17, 377)} y="76" fill="#42e493" fontSize="10">
                Force {forceAtTime(cursorTime, trace).toFixed(2)} g
              </text>
            </g>
          )}
        </svg>
      </div>
    </section>
  );
}
