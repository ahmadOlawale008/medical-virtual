"use client";

import { useState, type PointerEvent } from "react";
import {
  forceAtTime,
  SIMPLE_TWITCH_WINDOW_MS,
  type TwitchTrace,
} from "../twitch-model";

const WIDTH = 520;
const HEIGHT = 310;
const PADDING = { left: 52, right: 18, top: 18, bottom: 38 };

export default function Oscilloscope({ trace }: { trace: TwitchTrace | null }) {
  const [cursor, setCursor] = useState<{ time: number; force: number } | null>(null);
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const x = (time: number) => PADDING.left + (time / SIMPLE_TWITCH_WINDOW_MS) * plotWidth;
  const y = (force: number) => PADDING.top + plotHeight - (force / 12) * plotHeight;
  const path = trace
    ? Array.from({ length: 251 }, (_, index) => {
        const time = (index / 250) * SIMPLE_TWITCH_WINDOW_MS;
        const force = forceAtTime(Math.max(0, time - 20), trace);
        return `${index === 0 ? "M" : "L"}${x(time).toFixed(1)},${y(force).toFixed(1)}`;
      }).join(" ")
    : null;
  const cursorX = cursor ? x(cursor.time) : 0;
  const cursorY = cursor ? y(cursor.force) : 0;
  const tooltipX = cursorX > WIDTH - 185 ? cursorX - 170 : cursorX + 10;

  function inspectTrace(event: PointerEvent<SVGSVGElement>) {
    if (!trace) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * WIDTH;
    const clampedX = Math.min(
      WIDTH - PADDING.right,
      Math.max(PADDING.left, pointerX),
    );
    const time = ((clampedX - PADDING.left) / plotWidth) * SIMPLE_TWITCH_WINDOW_MS;
    const force = forceAtTime(Math.max(0, time - 20), trace);
    setCursor({ time, force });
  }

  return (
    <section className="rounded-lg border border-white/10 bg-black/25 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[.12em] text-white/45">OSCILLOSCOPE</p>
          <p className="mt-1 text-xs font-semibold text-white">Isometric muscle twitch</p>
        </div>
        <div className="text-right font-accent text-[10px] leading-4 text-[#55df9a]">
          <p>CH1: {trace?.voltage.toFixed(1) ?? "—"} V</p>
          <p>TIME: 50 ms/div</p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full touch-none cursor-crosshair rounded-md border border-white/15 bg-[#020806]"
        role="img"
        aria-label="Interactive force against time oscilloscope trace"
        onPointerMove={inspectTrace}
        onPointerDown={inspectTrace}
      >
        <defs>
          <pattern id="small-grid" width={plotWidth / 50} height={plotHeight / 24} patternUnits="userSpaceOnUse">
            <path d={`M ${plotWidth / 50} 0 L 0 0 0 ${plotHeight / 24}`} fill="none" stroke="#163023" strokeWidth="0.65" />
          </pattern>
          <pattern id="large-grid" width={plotWidth / 10} height={plotHeight / 6} patternUnits="userSpaceOnUse">
            <rect width={plotWidth / 10} height={plotHeight / 6} fill="url(#small-grid)" />
            <path d={`M ${plotWidth / 10} 0 L 0 0 0 ${plotHeight / 6}`} fill="none" stroke="#214430" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x={PADDING.left} y={PADDING.top} width={plotWidth} height={plotHeight} fill="url(#large-grid)" />

        {[0, 5, 12].map((force) => (
          <g key={force}>
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y(force)} y2={y(force)} stroke="#315244" strokeDasharray="4 5" />
            <text x={PADDING.left - 9} y={y(force) + 4} textAnchor="end" fill="#729084" fontSize="10">{force}</text>
          </g>
        ))}
        {Array.from({ length: 11 }, (_, index) => index * 50).map((time) => (
          <text key={time} x={x(time)} y={HEIGHT - 15} textAnchor="middle" fill="#729084" fontSize="9">{time}</text>
        ))}
        <text x={WIDTH / 2} y={HEIGHT - 3} textAnchor="middle" fill="#729084" fontSize="10">Time (ms)</text>
        <text x="13" y={HEIGHT / 2} textAnchor="middle" fill="#729084" fontSize="10" transform={`rotate(-90 13 ${HEIGHT / 2})`}>Force (g)</text>

        <line x1={x(20)} x2={x(20)} y1={PADDING.top} y2={PADDING.top + plotHeight} stroke="#eb5656" strokeWidth="1.3" />
        <text x={x(20) + 6} y={PADDING.top + 12} fill="#eb5656" fontSize="9">Stim</text>
        {path && (
          <path
            key={trace?.id ?? 0}
            d={path}
            fill="none"
            stroke={trace?.peakForce ? "#53df98" : "#64756d"}
            strokeWidth="2.4"
            strokeLinecap="round"
            className="twitch-trace"
            pathLength="1"
          />
        )}
        {trace && cursor && (
          <g className="pointer-events-none">
            <line
              x1={cursorX}
              x2={cursorX}
              y1={PADDING.top}
              y2={PADDING.top + plotHeight}
              stroke="#eef4ef"
              strokeWidth="1.2"
            />
            <circle
              cx={cursorX}
              cy={cursorY}
              r="4.5"
              fill="#53df98"
              stroke="#f5fff9"
              strokeWidth="2"
            />
            <rect
              x={tooltipX}
              y="28"
              width="160"
              height="51"
              rx="4"
              fill="#101a2d"
              fillOpacity="0.96"
              stroke="#41516c"
            />
            <text x={tooltipX + 11} y="48" fill="#b9c5d8" fontSize="11">
              TIME: {cursor.time.toFixed(1)} ms
            </text>
            <text x={tooltipX + 11} y="68" fill="#53df98" fontSize="12" fontWeight="700">
              FORCE: {cursor.force.toFixed(2)} g
            </text>
          </g>
        )}
      </svg>
    </section>
  );
}
