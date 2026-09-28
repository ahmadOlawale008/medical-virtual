"use client";

import type { StimulusStrengthRecording } from "../stimulus-strength-model";
import { STRENGTH_MAX_RESPONSE } from "../stimulus-strength-model";

const WIDTH = 560;
const HEIGHT = 280;
const PADDING = { left: 42, right: 18, top: 24, bottom: 48 };

export default function StimulusStrengthChart({
  recordings,
  elapsedMs,
}: {
  recordings: StimulusStrengthRecording[];
  elapsedMs: number;
}) {
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const baseline = PADDING.top + plotHeight;
  const latest = recordings.at(-1);
  const xAt = (index: number) =>
    recordings.length <= 1
      ? PADDING.left + plotWidth / 2
      : PADDING.left + (index / Math.max(1, recordings.length - 1)) * plotWidth;
  const barHeight = (force: number) =>
    Math.max(0, (force / STRENGTH_MAX_RESPONSE) * (plotHeight - 16));

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#02070d] p-3">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[.13em] text-white/40">
            RECRUITMENT CURVE
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white/80">
            Make versus break response
          </h2>
        </div>
        {latest && (
          <p className="font-accent text-[10px] text-[#54d6df]">
            {latest.distance} cm · {latest.voltage.toFixed(1)} V
          </p>
        )}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Make and break response amplitude at each induction-coil distance"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={`horizontal-${fraction}`}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={PADDING.top + fraction * plotHeight}
            y2={PADDING.top + fraction * plotHeight}
            stroke="#11242e"
          />
        ))}
        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={baseline}
          y2={baseline}
          stroke="#687785"
        />
        <text x="7" y="18" fill="#80919f" fontSize="10">Amplitude</text>
        <text x={WIDTH / 2} y={HEIGHT - 7} textAnchor="middle" fill="#80919f" fontSize="10">
          Distance between coils (cm)
        </text>

        {recordings.map((recording, index) => {
          const isLatest = index === recordings.length - 1;
          const makeProgress = isLatest ? Math.min(1, elapsedMs / 200) : 1;
          const breakProgress = isLatest
            ? Math.min(1, Math.max(0, (elapsedMs - 500) / 200))
            : 1;
          const x = xAt(index);
          const makeHeight = barHeight(recording.makeForce) * makeProgress;
          const breakHeight = barHeight(recording.breakForce) * breakProgress;

          return (
            <g key={recording.id}>
              <line
                x1={x - 8}
                x2={x - 8}
                y1={baseline}
                y2={baseline - makeHeight}
                stroke="#f5c518"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <line
                x1={x + 8}
                x2={x + 8}
                y1={baseline}
                y2={baseline - breakHeight}
                stroke="#ff7277"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <text x={x} y={baseline + 17} textAnchor="middle" fill="#dce5eb" fontSize="10">
                {recording.distance}
              </text>
              <text x={x - 8} y={baseline + 32} textAnchor="middle" fill="#f5c518" fontSize="9">M</text>
              <text x={x + 8} y={baseline + 32} textAnchor="middle" fill="#ff7277" fontSize="9">B</text>
            </g>
          );
        })}

        <g transform={`translate(${WIDTH - 126} 12)`}>
          <rect width="8" height="8" fill="#f5c518" />
          <text x="13" y="8" fill="#b8c4cc" fontSize="9">Make (M)</text>
          <rect y="14" width="8" height="8" fill="#ff7277" />
          <text x="13" y="22" fill="#b8c4cc" fontSize="9">Break (B)</text>
        </g>
      </svg>
    </section>
  );
}
