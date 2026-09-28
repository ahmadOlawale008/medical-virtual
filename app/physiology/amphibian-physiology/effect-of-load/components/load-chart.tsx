"use client";

import { useMemo } from "react";
import {
  createLoadRecording,
  LOAD_AXIS_MAX,
  LOAD_WINDOW_MS,
  type LoadMode,
  type LoadRecording,
} from "../load-model";

const WIDTH = 500;
const HEIGHT = 255;
const PADDING = { left: 40, right: 16, top: 20, bottom: 34 };

export default function LoadChart({
  recordings,
  load,
  mode,
  display,
  onDisplayChange,
}: {
  recordings: LoadRecording[];
  load: number;
  mode: LoadMode;
  display: "curve" | "line";
  onDisplayChange: (display: "curve" | "line") => void;
}) {
  const preview = useMemo(
    () => createLoadRecording(-1, load, mode),
    [load, mode],
  );
  const latest = recordings.at(-1) ?? preview;
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const timeX = (time: number) =>
    PADDING.left + (time / LOAD_WINDOW_MS) * plotWidth;
  const valueY = (value: number) =>
    PADDING.top + plotHeight - (value / LOAD_AXIS_MAX) * plotHeight;
  const loadX = (grams: number) => PADDING.left + (grams / 100) * plotWidth;
  const recordedOrPreview = recordings.length ? recordings : [preview];

  const tracePath = (recording: LoadRecording) =>
    recording.samples
      ?.map(
        (sample, index) =>
          `${index ? "L" : "M"}${timeX(sample.time).toFixed(1)},${valueY(sample.force).toFixed(1)}`,
      )
      .join(" ") ?? "";

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-black">
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[.13em] text-white/40">
              {display === "curve" ? "ISOTONIC RECORDING" : "LOAD COMPARISON"}
            </p>
            <h2 className="mt-1 text-sm font-semibold text-white/80">
              {display === "curve" ? "Muscle shortening over time" : "Shortening at each load"}
            </h2>
          </div>
          <p className="font-accent text-[10px] text-[#50d99c]">
            {latest.shortening.toFixed(2)} mm
          </p>
        </div>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label={display === "curve" ? "Isotonic muscle shortening trace" : "Vertical-line load comparison"}
        >
          {display === "curve" ? (
            <>
              {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
                <line
                  key={`curve-h-${fraction}`}
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={PADDING.top + fraction * plotHeight}
                  y2={PADDING.top + fraction * plotHeight}
                  stroke="#172c28"
                />
              ))}
              {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
                <line
                  key={`curve-v-${fraction}`}
                  x1={PADDING.left + fraction * plotWidth}
                  x2={PADDING.left + fraction * plotWidth}
                  y1={PADDING.top}
                  y2={PADDING.top + plotHeight}
                  stroke="#10241f"
                />
              ))}
              <text x="6" y="16" fill="#809c94" fontSize="9">Shortening (mm)</text>
              <text x={WIDTH - 16} y={HEIGHT - 8} textAnchor="end" fill="#809c94" fontSize="9">Time (ms)</text>
              {recordings.slice(0, -1).map((recording) => (
                <path
                  key={recording.id}
                  d={tracePath(recording)}
                  fill="none"
                  stroke={recording.color}
                  strokeWidth="1.35"
                  opacity="0.35"
                />
              ))}
              <path
                d={tracePath(latest)}
                fill="none"
                stroke={latest.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="twitch-trace"
              />
            </>
          ) : (
            <>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={valueY(0)}
                y2={valueY(0)}
                stroke="#657988"
              />
              <text x="6" y="16" fill="#809c94" fontSize="9">Shortening (mm)</text>
              <text x={WIDTH - 16} y={HEIGHT - 8} textAnchor="end" fill="#809c94" fontSize="9">Load (g)</text>
              {recordedOrPreview.map((recording, index) => (
                <g key={recording.id}>
                  <line
                    x1={loadX(recording.load)}
                    x2={loadX(recording.load)}
                    y1={valueY(0)}
                    y2={valueY(recording.shortening)}
                    stroke={recording.color}
                    strokeWidth={recordings.length ? "5" : "3"}
                    strokeLinecap="round"
                    opacity={recordings.length ? 1 : 0.65}
                  />
                  <text
                    x={loadX(recording.load)}
                    y={valueY(0) + 18 + (index % 2) * 10}
                    textAnchor="middle"
                    fill="#a3b1bd"
                    fontSize="9"
                  >
                    {recording.load}g
                  </text>
                </g>
              ))}
            </>
          )}
        </svg>
      </div>
      <div className="grid grid-cols-2 border-t border-white/8 bg-[#111827] p-2">
        <button
          type="button"
          onClick={() => onDisplayChange("curve")}
          className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition ${display === "curve" ? "bg-[#2a61dc] text-white" : "text-white/55 hover:text-white"}`}
        >
          Curve mode
        </button>
        <button
          type="button"
          onClick={() => onDisplayChange("line")}
          className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition ${display === "line" ? "bg-[#2a61dc] text-white" : "text-white/55 hover:text-white"}`}
        >
          Line mode
        </button>
      </div>
    </section>
  );
}
