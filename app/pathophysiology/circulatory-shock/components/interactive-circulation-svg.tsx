"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ShockModel, ShockResults } from "./model";
import { clamp } from "./model";

type Props = {
  model: ShockModel;
  results: ShockResults;
};

type FlowCell = {
  element: SVGGElement;
  path: SVGPathElement;
  pathLength: number;
  phase: number;
  speed: number;
};

const redVessel = "rgb(225, 65, 65)";
const blueVessel = "rgb(86, 101, 198)";
const svgNamespace = "http://www.w3.org/2000/svg";
const xlinkNamespace = "http://www.w3.org/1999/xlink";

export default function InteractiveCirculationSvg({ model, results }: Props) {
  const objectRef = useRef<HTMLObjectElement>(null);
  const frameRef = useRef<number | null>(null);
  const flowTimeRef = useRef(0);
  const previousFrameRef = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const configureSvg = useCallback(() => {
    const svgDocument = objectRef.current?.contentDocument;
    const svg = svgDocument?.querySelector("svg");
    if (!svgDocument || !svg) return;

    svgDocument.querySelectorAll(".medlab-blood-cell").forEach((cell) => cell.remove());

    const paths = Array.from(svgDocument.querySelectorAll<SVGPathElement>("path"));
    const flowPaths = paths.filter((path) => {
      const style = path.getAttribute("style") ?? "";
      return path.hasAttribute("marker-end") || style.includes("marker-end");
    });

    flowPaths.forEach((path, pathIndex) => {
      path.classList.add("circulation-flow-path");
      if (!path.id) path.id = `medlab-flow-path-${pathIndex}`;

      addBloodCell(svgDocument, path, "red", pathIndex, 0);
      addBloodCell(svgDocument, path, "red", pathIndex, 1);

      if (pathIndex % 3 === 0) {
        addBloodCell(svgDocument, path, "white", pathIndex, 0);
      }
    });

    paths.forEach((path) => {
      const fill = svgDocument.defaultView?.getComputedStyle(path).fill;
      if (fill === redVessel || fill === blueVessel) {
        path.classList.add("circulation-vessel");
      }
    });

    let style = svgDocument.getElementById("medlab-circulation-motion") as SVGStyleElement | null;
    if (!style) {
      style = svgDocument.createElementNS(svgNamespace, "style");
      style.id = "medlab-circulation-motion";
      svg.appendChild(style);
    }

    style.textContent = `
      .circulation-vessel {
        opacity: var(--vessel-opacity);
        filter: saturate(var(--vessel-saturation));
        transition: opacity 280ms ease, filter 280ms ease;
      }
      .circulation-flow-path {
        animation: none !important;
        opacity: .92 !important;
        stroke-width: .75 !important;
        stroke-dasharray: 1.7 1.25 !important;
        stroke-linecap: round !important;
        filter: drop-shadow(0 0 .45px currentColor);
      }
      .medlab-blood-cell {
        animation: none !important;
        display: inline !important;
        opacity: 1 !important;
        overflow: visible;
        pointer-events: none;
        filter: drop-shadow(0 1px 1px rgba(42, 19, 21, .35));
      }
      .medlab-wbc {
        filter: drop-shadow(0 1px 1.2px rgba(58, 42, 74, .42));
      }
    `;

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const svgDocument = objectRef.current?.contentDocument;
    const svg = svgDocument?.querySelector("svg");
    if (!svgDocument || !svg) return;

    const volume = clamp(1 - model.volumeLoss / 110, 0.2, 1);
    const perfusion = clamp(results.perfusion / 100, 0.12, 1);
    const cycleDuration = clamp(7.4 / (results.cardiacOutput / 5.2), 5.2, 15);

    svg.style.setProperty("--vessel-opacity", `${0.64 + volume * 0.36}`);
    svg.style.setProperty("--vessel-saturation", `${0.72 + perfusion * 0.4}`);

    const flowPaths = Array.from(
      svgDocument.querySelectorAll<SVGPathElement>(".circulation-flow-path"),
    );
    const cells = Array.from(
      svgDocument.querySelectorAll<SVGGElement>(".medlab-blood-cell"),
    )
      .map((element): FlowCell | null => {
        const pathId = element.dataset.pathId;
        const path = pathId
          ? svgDocument.getElementById(pathId) as SVGPathElement | null
          : null;

        if (!path) return null;

        return {
          element,
          path,
          pathLength: path.getTotalLength(),
          phase: Number(element.dataset.phase ?? 0),
          speed: Number(element.dataset.speed ?? 1),
        };
      })
      .filter((cell): cell is FlowCell => cell !== null);

    const renderFrame = (timestamp: number) => {
      const previous = previousFrameRef.current ?? timestamp;
      const elapsed = Math.min(timestamp - previous, 48);
      previousFrameRef.current = timestamp;

      if (isRunning) {
        flowTimeRef.current += elapsed / 1000;
      }

      const flowTime = flowTimeRef.current;

      flowPaths.forEach((path, index) => {
        const direction = index < 3 || index > 9 ? -1 : 1;
        path.style.strokeDashoffset = `${direction * flowTime * 3.2}`;
      });

      cells.forEach(({ element, path, pathLength, phase, speed }) => {
        const progress = (phase + flowTime / (cycleDuration * speed)) % 1;
        const point = path.getPointAtLength(pathLength * progress);
        const nextPoint = path.getPointAtLength(
          Math.min(pathLength, pathLength * progress + 0.18),
        );
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;

        element.setAttribute(
          "transform",
          `translate(${point.x} ${point.y}) rotate(${angle})`,
        );
      });

      frameRef.current = window.requestAnimationFrame(renderFrame);
    };

    previousFrameRef.current = null;
    frameRef.current = window.requestAnimationFrame(renderFrame);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isReady, isRunning, model.volumeLoss, results.cardiacOutput, results.perfusion]);

  return (
    <div className="relative size-full">
      <object
        ref={objectRef}
        data="/assets/medical/circulatory-shock/human-circulatory-system.svg?v=3"
        type="image/svg+xml"
        aria-label="Interactive anatomical diagram showing blood cells moving through pulmonary and systemic circulation"
        className="size-full object-contain transition-[filter,opacity] duration-300"
        onLoad={configureSvg}
        style={{
          filter: `contrast(${0.94 + results.perfusion / 1000})`,
          opacity: 0.82 + clamp(results.perfusion / 100, 0.12, 1) * 0.18,
        }}
      >
        Anatomical diagram of pulmonary and systemic circulation.
      </object>

      <button
        type="button"
        onClick={() => setIsRunning((current) => !current)}
        className="absolute bottom-2 left-2 min-h-9 cursor-pointer rounded-md border border-border bg-white/95 px-3 text-[10px] font-semibold text-foreground shadow-sm hover:border-primary"
      >
        {isRunning ? "Pause blood flow" : "Run blood flow"}
      </button>

      <div className="absolute bottom-2 right-2 rounded-md border border-border bg-white/95 px-3 py-2 text-right shadow-sm">
        <p className="text-[8px] font-semibold tracking-[.08em] text-muted">FLOW SPEED</p>
        <p className="mt-0.5 font-accent text-xs font-bold">{results.cardiacOutput.toFixed(1)} L/min</p>
      </div>
    </div>
  );
}

function addBloodCell(
  svgDocument: Document,
  path: SVGPathElement,
  type: "red" | "white",
  pathIndex: number,
  cellIndex: number,
) {
  const group = svgDocument.createElementNS(svgNamespace, "g");
  const image = svgDocument.createElementNS(svgNamespace, "image");
  const isWhiteCell = type === "white";
  const size = isWhiteCell ? 8.8 : 7.2;
  const asset = isWhiteCell
    ? "/assets/medical/blood-cells/white-blood-cell-nih.png"
    : "/assets/medical/blood-cells/red-blood-cell-nih.svg";

  group.classList.add(
    "medlab-blood-cell",
    isWhiteCell ? "medlab-wbc" : "medlab-rbc",
  );
  group.dataset.pathId = path.id;
  group.dataset.phase = `${(pathIndex * 0.137 + cellIndex * 0.48) % 1}`;
  group.dataset.speed = isWhiteCell ? "1.35" : cellIndex === 0 ? "1" : "1.12";
  group.setAttribute("aria-hidden", "true");

  if (isWhiteCell) {
    const cellBody = svgDocument.createElementNS(svgNamespace, "circle");
    const nucleus = svgDocument.createElementNS(svgNamespace, "path");

    cellBody.setAttribute("r", "3.2");
    cellBody.setAttribute("fill", "#fffdf7");
    cellBody.setAttribute("stroke", "#69487e");
    cellBody.setAttribute("stroke-width", ".65");
    nucleus.setAttribute(
      "d",
      "M-1.8-.4C-1.6-2.2.5-2.5 1.2-1.2 2.5-.7 2.1 1.7.4 1.5-1 2.4-2.5 1.1-1.8-.4Z",
    );
    nucleus.setAttribute("fill", "#76568a");
    group.append(cellBody, nucleus);
  } else {
    const cellBody = svgDocument.createElementNS(svgNamespace, "ellipse");
    const center = svgDocument.createElementNS(svgNamespace, "ellipse");

    cellBody.setAttribute("rx", "3.25");
    cellBody.setAttribute("ry", "2.15");
    cellBody.setAttribute("fill", "#d9333f");
    cellBody.setAttribute("stroke", "#791b27");
    cellBody.setAttribute("stroke-width", ".6");
    center.setAttribute("rx", "1.35");
    center.setAttribute("ry", ".76");
    center.setAttribute("fill", "#f59a92");
    group.append(cellBody, center);
  }

  image.setAttribute("x", `${-size / 2}`);
  image.setAttribute("y", `${-size / 2}`);
  image.setAttribute("width", `${size}`);
  image.setAttribute("height", `${size}`);
  image.setAttribute("preserveAspectRatio", "xMidYMid meet");
  image.setAttribute("opacity", ".92");
  image.setAttribute("href", asset);
  image.setAttributeNS(xlinkNamespace, "href", asset);

  group.appendChild(image);
  path.parentElement?.appendChild(group);
}
