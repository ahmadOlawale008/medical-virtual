"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import type { HeartFailureModel, HemodynamicResults } from "./model";
import { clamp } from "./model";

type Props = {
  model: HeartFailureModel;
  results: HemodynamicResults;
};

const flowPaths = [
  { id: "venous-return", d: "M37 270C58 270 83 256 103 236", color: "#387fa8" },
  { id: "right-heart", d: "M105 236C91 204 91 174 58 146", color: "#387fa8" },
  { id: "pulmonary-return", d: "M276 148C246 151 219 159 198 181", color: "#d94f59" },
  { id: "left-heart", d: "M198 181C212 216 214 245 193 279", color: "#d94f59" },
  { id: "systemic-output", d: "M193 279C230 220 220 123 177 92C164 74 169 45 182 22", color: "#d94f59" },
] as const;

export default function HeartAnatomy({ model, results }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [running, setRunning] = useState(true);
  const beatDuration = clamp(60 / model.heartRate, 0.48, 1.2);
  const flowDuration = clamp(7.2 / (results.cardiacOutput / 5.2), 4.5, 12);
  const contractileScale = 1 + model.contractility / 2400;

  return (
    <section className="relative flex min-h-0 flex-col overflow-hidden rounded-lg border border-[#d8bdb3] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#e2d2cc] bg-[#fffaf8] px-4 py-2.5">
        <div>
          <p className="text-[10px] font-semibold tracking-[.08em] text-[#75544c]">
            FOUR-CHAMBER FLOW
          </p>
          <p className="mt-0.5 text-[9px] text-[#8d7770]">Chambers · valves · great vessels</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRunning((current) => {
              if (current) svgRef.current?.pauseAnimations();
              else svgRef.current?.unpauseAnimations();
              return !current;
            });
          }}
          className="min-h-8 cursor-pointer rounded-md border border-[#d8bdb3] px-3 text-[10px] font-semibold text-[#75544c] hover:bg-[#f7efec]"
        >
          {running ? "Pause flow" : "Run flow"}
        </button>
      </div>

      <div className="relative mx-auto min-h-0 w-full max-w-[410px] flex-1">
        <div
          className="absolute inset-3 transition-transform duration-300"
          style={{
            animation: running ? `heart-anatomy-beat ${beatDuration}s ease-in-out infinite` : "none",
            transformOrigin: "52% 60%",
            "--heart-contractile-scale": contractileScale,
          } as CSSProperties}
        >
          <Image
            src="/assets/medical/heart-failure/heart-blood-flow-anatomy.svg"
            alt="Cutaway anatomical diagram of the four heart chambers, valves, and major vessels"
            fill
            priority
            sizes="(max-width: 1280px) 65vw, 410px"
            className="object-contain"
          />
        </div>

        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-3 size-[calc(100%-1.5rem)]"
          viewBox="0 0 330 370"
          aria-hidden="true"
        >
          <defs>
            <filter id="cellGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity=".42" />
            </filter>
          </defs>

          {flowPaths.map((path) => (
            <path
              key={path.id}
              id={path.id}
              d={path.d}
              fill="none"
              stroke={path.color}
              strokeWidth="2.2"
              strokeDasharray="3 5"
              strokeLinecap="round"
              opacity=".68"
              className={running ? "heart-flow-dash" : ""}
              style={{ animationDuration: `${flowDuration / 2}s` }}
            />
          ))}

          {flowPaths.flatMap((path, pathIndex) =>
            [0, 1].map((particleIndex) => (
              <circle
                key={`${path.id}-${particleIndex}`}
                r="3.2"
                fill={path.color}
                stroke="#fff"
                strokeWidth="1"
                filter="url(#cellGlow)"
              >
                <animateMotion
                  dur={`${flowDuration}s`}
                  begin={`${-(pathIndex * 0.62 + particleIndex * flowDuration / 2)}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                  path={path.d}
                />
              </circle>
            )),
          )}
        </svg>

        <div className="absolute bottom-3 left-3 rounded-md border border-[#d8bdb3] bg-white/95 px-2.5 py-2 shadow-sm">
          <p className="text-[8px] font-semibold text-[#806c66]">FORWARD FLOW</p>
          <p className="mt-0.5 font-accent text-sm font-bold text-[#4c2e29]">
            {results.cardiacOutput.toFixed(1)} L/min
          </p>
        </div>

        <div className="absolute bottom-3 right-3 rounded-md border border-[#d8bdb3] bg-white/95 px-2.5 py-2 text-right shadow-sm">
          <p className="text-[8px] font-semibold text-[#806c66]">EJECTION FRACTION</p>
          <p className="mt-0.5 font-accent text-sm font-bold text-[#4c2e29]">
            {results.ejectionFraction.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-[#e2d2cc] bg-[#fffaf8] text-[9px] text-[#806c66]">
        <span className="flex items-center gap-2 px-3 py-2">
          <span className="size-2 rounded-full bg-[#387fa8]" />
          Venous → right heart → lungs
        </span>
        <span className="flex items-center gap-2 border-l border-[#e2d2cc] px-3 py-2">
          <span className="size-2 rounded-full bg-[#d94f59]" />
          Lungs → left heart → systemic
        </span>
      </div>
    </section>
  );
}
