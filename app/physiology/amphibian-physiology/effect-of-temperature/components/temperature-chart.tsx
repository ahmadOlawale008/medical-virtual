"use client";

import { useState, type PointerEvent } from "react";
import { forceAtTime } from "../../simple-muscle-twitch/twitch-model";
import {
  TEMPERATURE_WINDOW_MS,
  type TemperatureRecording,
} from "../temperature-model";

const WIDTH = 520;
const HEIGHT = 330;
const MAX_TIME = TEMPERATURE_WINDOW_MS;
const MAX_FORCE = 10;
const PADDING = { left: 52, right: 18, top: 54, bottom: 38 };

export default function TemperatureChart({
  recordings,
}: {
  recordings: TemperatureRecording[];
}) {
  const [cursor, setCursor] = useState<number | null>(null);
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const x = (time: number) => PADDING.left + (time / MAX_TIME) * plotWidth;
  const y = (force: number) => PADDING.top + plotHeight - (force / MAX_FORCE) * plotHeight;

  function inspect(event: PointerEvent<SVGSVGElement>) {
    if (recordings.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * WIDTH;
    const clampedX = Math.min(WIDTH - PADDING.right, Math.max(PADDING.left, pointerX));
    setCursor(((clampedX - PADDING.left) / plotWidth) * MAX_TIME);
  }

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold tracking-[.08em] text-white/55">
        TEMPERATURE COMPARISON
      </h2>
      <div className="rounded-lg border border-white/10 bg-[#020817] p-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full touch-none cursor-crosshair"
          role="img"
          aria-label="Interactive comparison of muscle twitch force at different temperatures"
          onPointerMove={inspect}
          onPointerDown={inspect}
        >
          {[0, 0.5, 1].map((fraction) => (
            <line
              key={`horizontal-${fraction}`}
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={PADDING.top + plotHeight * fraction}
              y2={PADDING.top + plotHeight * fraction}
              stroke="#27344a"
            />
          ))}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <line
              key={`vertical-${fraction}`}
              x1={PADDING.left + plotWidth * fraction}
              x2={PADDING.left + plotWidth * fraction}
              y1={PADDING.top}
              y2={PADDING.top + plotHeight}
              stroke="#27344a"
            />
          ))}

          <text x="17" y={PADDING.top + plotHeight + 5} fill="#8795ac" fontSize="12">PS</text>
          <text x={WIDTH - 20} y="18" textAnchor="end" fill="#8795ac" fontSize="10">LW = Warm</text>
          <text x={WIDTH - 20} y="32" textAnchor="end" fill="#8795ac" fontSize="10">LN = Normal</text>
          <text x={WIDTH - 20} y="46" textAnchor="end" fill="#8795ac" fontSize="10">LC = Cold</text>

          {recordings.map((recording) => {
            const path = Array.from(
              { length: TEMPERATURE_WINDOW_MS / 2 + 1 },
              (_, index) => {
              const time = index * 2;
              const force = forceAtTime(time, recording);
              return `${index === 0 ? "M" : "L"}${x(time).toFixed(1)},${y(force).toFixed(1)}`;
              },
            ).join(" ");
            const peakTime = recording.latency + recording.contraction;

            return (
              <g key={recording.id}>
                <path
                  d={path}
                  fill="none"
                  stroke={recording.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="twitch-trace"
                  pathLength="1"
                />
                <text
                  x={x(peakTime) + 9}
                  y={y(recording.peakForce) - 9}
                  fill={recording.color}
                  fontSize="12"
                  fontWeight="700"
                >
                  {recording.temperature}°C
                </text>
              </g>
            );
          })}

          {cursor !== null && recordings.length > 0 && (
            <g className="pointer-events-none">
              <line
                x1={x(cursor)}
                x2={x(cursor)}
                y1={PADDING.top}
                y2={PADDING.top + plotHeight}
                stroke="#f1f5f2"
                strokeWidth="1"
              />
              {recordings.map((recording) => {
                const force = forceAtTime(cursor, recording);
                return (
                  <circle
                    key={recording.id}
                    cx={x(cursor)}
                    cy={y(force)}
                    r="3.5"
                    fill={recording.color}
                    stroke="#fff"
                  />
                );
              })}
              <rect x={Math.min(x(cursor) + 8, 376)} y="61" width="125" height={25 + recordings.length * 17} rx="4" fill="#111a2c" stroke="#40506b" />
              <text x={Math.min(x(cursor) + 18, 386)} y="78" fill="#c7d0df" fontSize="10">TIME {cursor.toFixed(1)} ms</text>
              {recordings.map((recording, index) => (
                <text key={recording.id} x={Math.min(x(cursor) + 18, 386)} y={95 + index * 17} fill={recording.color} fontSize="10">
                  {recording.temperature}°C · {forceAtTime(cursor, recording).toFixed(2)} g
                </text>
              ))}
            </g>
          )}
        </svg>
      </div>
    </section>
  );
}
