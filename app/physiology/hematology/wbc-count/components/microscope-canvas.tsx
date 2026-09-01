"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStageCenter,
  LEUKOCYTES,
  OBJECTIVE_ZOOM,
  SQUARES,
  type Objective,
  type SquareId,
} from "../model";

type StagePosition = { x: number; y: number };

type Props = {
  objective: Objective;
  activeSquare: SquareId;
  stage: StagePosition;
  countedCells: Set<string>;
  onToggleCell: (cellId: string) => void;
  onPan: (deltaX: number, deltaY: number) => void;
};

const VIEW_SIZE = 760;
const VIEW_RADIUS = 342;
const WORLD_UNIT = 190;

export default function MicroscopeCanvas({
  objective,
  activeSquare,
  stage,
  countedCells,
  onToggleCell,
  onPan,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    lastX: number;
    lastY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const getTransform = useCallback(() => {
    const zoom = OBJECTIVE_ZOOM[objective];
    const center = getStageCenter(objective, activeSquare, stage);
    const pixelsPerUnit = WORLD_UNIT * zoom;

    return { centerX: center.x, centerY: center.y, pixelsPerUnit };
  }, [activeSquare, objective, stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = VIEW_SIZE * ratio;
    canvas.height = VIEW_SIZE * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const { centerX, centerY, pixelsPerUnit } = getTransform();
    const toScreen = (x: number, y: number) => ({
      x: VIEW_SIZE / 2 + (x - centerX) * pixelsPerUnit,
      y: VIEW_SIZE / 2 + (y - centerY) * pixelsPerUnit,
    });

    context.clearRect(0, 0, VIEW_SIZE, VIEW_SIZE);
    context.save();
    context.beginPath();
    context.arc(VIEW_SIZE / 2, VIEW_SIZE / 2, VIEW_RADIUS, 0, Math.PI * 2);
    context.clip();

    const background = context.createRadialGradient(380, 350, 40, 380, 380, 360);
    background.addColorStop(0, "#f9fbf9");
    background.addColorStop(0.72, "#edf1ec");
    background.addColorStop(1, "#c8d0cb");
    context.fillStyle = background;
    context.fillRect(0, 0, VIEW_SIZE, VIEW_SIZE);

    drawChamber(context, toScreen, pixelsPerUnit, activeSquare);
    drawDebris(context, objective);

    for (const cell of LEUKOCYTES) {
      const point = toScreen(cell.x, cell.y);
      const visibilityScale = objective === 4 ? 0.24 : objective === 10 ? 0.55 : 1;
      const radius = Math.max(0.35, cell.radius * pixelsPerUnit * visibilityScale);
      if (
        Math.hypot(point.x - VIEW_SIZE / 2, point.y - VIEW_SIZE / 2) >
        VIEW_RADIUS + radius
      ) {
        continue;
      }

      drawLeukocyte(
        context,
        point.x,
        point.y,
        radius,
        cell.lobes,
        countedCells.has(cell.id),
      );
    }

    context.restore();
    drawEyepiece(context);
  }, [activeSquare, countedCells, getTransform, objective]);

  function toggleCellAtPointer(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * VIEW_SIZE;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * VIEW_SIZE;
    if (Math.hypot(pointerX - 380, pointerY - 380) > VIEW_RADIUS) return;

    const { centerX, centerY, pixelsPerUnit } = getTransform();
    const worldX = centerX + (pointerX - VIEW_SIZE / 2) / pixelsPerUnit;
    const worldY = centerY + (pointerY - VIEW_SIZE / 2) / pixelsPerUnit;

    const closest = LEUKOCYTES.map((cell) => ({
        cell,
        distance: Math.hypot(cell.x - worldX, cell.y - worldY),
      }))
      .filter(({ cell, distance }) =>
        distance <= Math.max(cell.radius * 1.8, 7 / pixelsPerUnit),
      )
      .sort((a, b) => a.distance - b.distance)[0];

    if (closest) onToggleCell(closest.cell.id);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
    };
    setDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const scaleToCanvas = VIEW_SIZE / bounds.width;
    const { pixelsPerUnit } = getTransform();
    const deltaX = ((event.clientX - drag.lastX) * scaleToCanvas) / pixelsPerUnit;
    const deltaY = ((event.clientY - drag.lastY) * scaleToCanvas) / pixelsPerUnit;

    if (deltaX !== 0 || deltaY !== 0) {
      onPan(-deltaX, -deltaY);
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const movement = Math.hypot(
      event.clientX - drag.startX,
      event.clientY - drag.startY,
    );
    if (movement < 5 && objective !== 4) toggleCellAtPointer(event);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setDragging(false);
  }

  return (
    <canvas
      ref={canvasRef}
      className={`block aspect-square h-auto w-full min-w-0 max-w-full touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label={`Interactive microscope view at ${objective} times magnification. Select visible white blood cells to count them.`}
      role="img"
    />
  );
}

function drawChamber(
  context: CanvasRenderingContext2D,
  toScreen: (x: number, y: number) => { x: number; y: number },
  pixelsPerUnit: number,
  activeSquare: SquareId,
) {
  context.lineCap = "square";

  for (let line = 0; line <= 3; line += 1) {
    drawWorldLine(context, toScreen, line, 0, line, 3, "#55616b", 0.013 * pixelsPerUnit);
    drawWorldLine(context, toScreen, 0, line, 3, line, "#55616b", 0.013 * pixelsPerUnit);
  }

  for (const [square, center] of Object.entries(SQUARES) as [SquareId, (typeof SQUARES)[SquareId]][]) {
    const originX = center.center[0] - 0.5;
    const originY = center.center[1] - 0.5;
    const active = square === activeSquare;

    for (let sub = 1; sub < 4; sub += 1) {
      const offset = sub / 4;
      const verticalStart = square === "W3" || square === "W4" ? originY - 1 : originY;
      const verticalEnd = square === "W1" || square === "W2" ? originY + 2 : originY + 1;
      const horizontalStart = square === "W2" || square === "W4" ? originX - 1 : originX;
      const horizontalEnd = square === "W1" || square === "W3" ? originX + 2 : originX + 1;
      drawWorldLine(
        context,
        toScreen,
        originX + offset,
        verticalStart,
        originX + offset,
        verticalEnd,
        active ? "#788995" : "#9aa4aa",
        Math.max(0.8, 0.005 * pixelsPerUnit),
      );
      drawWorldLine(
        context,
        toScreen,
        horizontalStart,
        originY + offset,
        horizontalEnd,
        originY + offset,
        active ? "#788995" : "#9aa4aa",
        Math.max(0.8, 0.005 * pixelsPerUnit),
      );
    }

    const label = toScreen(center.center[0], center.center[1]);
    context.save();
    context.fillStyle = "rgba(92, 107, 119, 0.13)";
    context.font = `600 ${Math.max(18, pixelsPerUnit * 0.34)}px Halenoir, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("W", label.x, label.y);
    context.restore();

    if (active) {
      drawWorldLine(context, toScreen, originX, originY, originX + 1, originY, "#4e5c66", 0.016 * pixelsPerUnit);
      drawWorldLine(context, toScreen, originX, originY, originX, originY + 1, "#4e5c66", 0.016 * pixelsPerUnit);
      drawWorldLine(context, toScreen, originX, originY + 1, originX + 1, originY + 1, "#4e5c66", 0.016 * pixelsPerUnit);
      drawWorldLine(context, toScreen, originX + 1, originY, originX + 1, originY + 1, "#4e5c66", 0.016 * pixelsPerUnit);
    }
  }

  for (let fine = 0; fine <= 20; fine += 1) {
    const position = 1 + fine / 20;
    const strong = fine % 5 === 0;
    drawWorldLine(context, toScreen, position, 1, position, 2, "#849098", (strong ? 0.006 : 0.0025) * pixelsPerUnit);
    drawWorldLine(context, toScreen, 1, position, 2, position, "#849098", (strong ? 0.006 : 0.0025) * pixelsPerUnit);
  }
}

function drawWorldLine(
  context: CanvasRenderingContext2D,
  toScreen: (x: number, y: number) => { x: number; y: number },
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
  dash: number[] = [],
) {
  const start = toScreen(x1, y1);
  const end = toScreen(x2, y2);
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = color;
  context.lineWidth = Math.max(0.7, width);
  context.setLineDash(dash);
  context.stroke();
  context.setLineDash([]);
}

function drawLeukocyte(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  lobes: number,
  counted: boolean,
) {
  context.save();
  context.shadowColor = "rgba(41, 23, 72, .18)";
  context.shadowBlur = radius < 2 ? 0 : radius * 0.3;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = counted ? "#d8f1e9" : "rgba(185, 166, 214, .72)";
  context.fill();
  context.strokeStyle = counted ? "#087f78" : "#735b96";
  context.lineWidth = Math.max(0.35, radius * 0.1);
  context.stroke();
  context.shadowBlur = 0;

  if (radius >= 3) for (let lobe = 0; lobe < lobes; lobe += 1) {
    const angle = (Math.PI * 2 * lobe) / lobes - Math.PI / 3;
    const lobeRadius = radius * (lobes === 1 ? 0.54 : 0.37);
    context.beginPath();
    context.arc(
      x + Math.cos(angle) * radius * 0.22,
      y + Math.sin(angle) * radius * 0.22,
      lobeRadius,
      0,
      Math.PI * 2,
    );
    context.fillStyle = counted ? "#087f78" : "#564077";
    context.fill();
  }

  if (counted) {
    context.beginPath();
    context.arc(x, y, radius * 1.36, 0, Math.PI * 2);
    context.strokeStyle = "#087f78";
    context.lineWidth = Math.max(1, radius * 0.12);
    context.stroke();
  }
  context.restore();
}

function drawDebris(context: CanvasRenderingContext2D, objective: Objective) {
  if (objective < 40) return;
  context.fillStyle = "rgba(115, 91, 150, .16)";
  for (let index = 0; index < 45; index += 1) {
    const x = 70 + ((index * 137) % 620);
    const y = 65 + ((index * 83) % 625);
    context.beginPath();
    context.arc(x, y, 1 + (index % 3) * 0.6, 0, Math.PI * 2);
    context.fill();
  }
}

function drawEyepiece(context: CanvasRenderingContext2D) {
  const vignette = context.createRadialGradient(380, 380, 305, 380, 380, 382);
  vignette.addColorStop(0, "rgba(3, 7, 9, 0)");
  vignette.addColorStop(0.75, "rgba(3, 7, 9, .08)");
  vignette.addColorStop(1, "rgba(3, 7, 9, .92)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, VIEW_SIZE, VIEW_SIZE);
  context.beginPath();
  context.arc(380, 380, VIEW_RADIUS, 0, Math.PI * 2);
  context.strokeStyle = "#26363e";
  context.lineWidth = 15;
  context.stroke();
  context.beginPath();
  context.arc(380, 380, VIEW_RADIUS + 9, 0, Math.PI * 2);
  context.strokeStyle = "#071014";
  context.lineWidth = 8;
  context.stroke();
}
