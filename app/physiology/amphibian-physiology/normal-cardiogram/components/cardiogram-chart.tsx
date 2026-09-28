"use client";

import {
  CARDIOGRAM_DURATION_MS,
  getTemperatureProfile,
  type CardiogramSample,
  type CardiogramTemperature,
} from "../cardiogram-model";

const WIDTH = 620;
const HEIGHT = 300;
const PADDING = { left: 32, right: 18, top: 24, bottom: 28 };

export default function CardiogramChart({
  samples,
  temperature,
}: {
  samples: CardiogramSample[];
  temperature: CardiogramTemperature;
}) {
  const profile = getTemperatureProfile(temperature);
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const xAt = (time: number) =>
    PADDING.left + (time / CARDIOGRAM_DURATION_MS) * plotWidth;
  const yAt = (force: number) =>
    PADDING.top + plotHeight - ((force + 0.2) / 4.5) * plotHeight;
  const path = samples
    .map(
      (sample, index) =>
        `${index === 0 ? "M" : "L"}${xAt(sample.time).toFixed(1)},${yAt(sample.force).toFixed(1)}`,
    )
    .join(" ");

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#02070d] p-3">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[.13em] text-white/40">
            OSCILLOSCOPE
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white/80">
            Frog heart cardiogram
          </h2>
        </div>
        <div className="text-right font-accent text-[10px]" style={{ color: profile.color }}>
          <p>HR: {profile.heartRate} BPM</p>
          <p>{profile.label} · {profile.state}</p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Frog heart contraction recording"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={`h-${fraction}`}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={PADDING.top + fraction * plotHeight}
            y2={PADDING.top + fraction * plotHeight}
            stroke="#123129"
          />
        ))}
        {Array.from({ length: 16 }, (_, index) => (
          <line
            key={`v-${index}`}
            x1={PADDING.left + (index / 15) * plotWidth}
            x2={PADDING.left + (index / 15) * plotWidth}
            y1={PADDING.top}
            y2={PADDING.top + plotHeight}
            stroke="#0d2822"
          />
        ))}
        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={yAt(0)}
          y2={yAt(0)}
          stroke="#2a5a4b"
        />
        {path && (
          <path
            d={path}
            fill="none"
            stroke={profile.color}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        <text x={WIDTH - 18} y={HEIGHT - 8} textAnchor="end" fill="#69857d" fontSize="9">
          15-second recording
        </text>
      </svg>
    </section>
  );
}
