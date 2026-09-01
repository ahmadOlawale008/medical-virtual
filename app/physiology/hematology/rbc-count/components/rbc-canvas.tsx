"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ERYTHROCYTES,
  OBJECTIVE_ZOOM,
  REGIONS,
  type Objective,
  type RegionId,
} from "../model";

const VIEW_SIZE = 760;
const VIEW_RADIUS = 342;
const WORLD_UNIT = 190;

export default function RbcCanvas({
  objective,
  stage,
  activeRegion,
  countedCells,
  onPan,
  onToggleCell,
}: {
  objective: Objective;
  stage: { x: number; y: number };
  activeRegion: RegionId;
  countedCells: Set<string>;
  onPan: (deltaX: number, deltaY: number) => void;
  onToggleCell: (cellId: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    lastX: number;
    lastY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const getTransform = useCallback(() => ({
    centerX: 1.5 + stage.x,
    centerY: 1.5 + stage.y,
    pixelsPerUnit: WORLD_UNIT * OBJECTIVE_ZOOM[objective],
  }), [objective, stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

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
    context.arc(380, 380, VIEW_RADIUS, 0, Math.PI * 2);
    context.clip();

    const background = context.createRadialGradient(370, 350, 35, 380, 380, 365);
    background.addColorStop(0, "#fbfcfa");
    background.addColorStop(0.72, "#eef1ed");
    background.addColorStop(1, "#cbd2ce");
    context.fillStyle = background;
    context.fillRect(0, 0, VIEW_SIZE, VIEW_SIZE);

    drawChamber(context, toScreen, pixelsPerUnit, activeRegion);

    const visibility = objective === 4 ? 0.18 : objective === 10 ? 0.48 : 1;
    for (const cell of ERYTHROCYTES) {
      const point = toScreen(cell.x, cell.y);
      const radius = Math.max(0.22, cell.radius * pixelsPerUnit * visibility);
      if (Math.hypot(point.x - 380, point.y - 380) > VIEW_RADIUS + radius) continue;
      drawErythrocyte(
        context,
        point.x,
        point.y,
        radius,
        cell.rotation,
        countedCells.has(cell.id),
      );
    }

    context.restore();
    drawEyepiece(context);
  }, [activeRegion, countedCells, getTransform, objective]);

  function toggleAtPointer(event: React.PointerEvent<HTMLCanvasElement>) {
    if (objective < 40) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * VIEW_SIZE;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * VIEW_SIZE;
    if (Math.hypot(pointerX - 380, pointerY - 380) > VIEW_RADIUS) return;

    const { centerX, centerY, pixelsPerUnit } = getTransform();
    const worldX = centerX + (pointerX - 380) / pixelsPerUnit;
    const worldY = centerY + (pointerY - 380) / pixelsPerUnit;
    const closest = ERYTHROCYTES.filter((cell) => cell.region === activeRegion)
      .map((cell) => ({ cell, distance: Math.hypot(cell.x - worldX, cell.y - worldY) }))
      .filter(({ cell, distance }) => distance <= Math.max(cell.radius * 1.7, 6 / pixelsPerUnit))
      .sort((a, b) => a.distance - b.distance)[0];
    if (closest) onToggleCell(closest.cell.id);
  }

  function pointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
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

  function pointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas || drag.pointerId !== event.pointerId) return;
    const bounds = canvas.getBoundingClientRect();
    const scale = VIEW_SIZE / bounds.width;
    const { pixelsPerUnit } = getTransform();
    onPan(
      -((event.clientX - drag.lastX) * scale) / pixelsPerUnit,
      -((event.clientY - drag.lastY) * scale) / pixelsPerUnit,
    );
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
  }

  function pointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const movement = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (movement < 5) toggleAtPointer(event);
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
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      role="img"
      aria-label={`Interactive erythrocyte counting chamber at ${objective} times magnification.`}
    />
  );
}

function drawChamber(
  context: CanvasRenderingContext2D,
  toScreen: (x: number, y: number) => { x: number; y: number },
  pixelsPerUnit: number,
  activeRegion: RegionId,
) {
  for (let line = 0; line <= 3; line += 1) {
    worldLine(context, toScreen, line, 0, line, 3, "#53616a", 0.013 * pixelsPerUnit);
    worldLine(context, toScreen, 0, line, 3, line, "#53616a", 0.013 * pixelsPerUnit);
  }

  drawCornerExtensions(context, toScreen, pixelsPerUnit);

  for (let line = 0; line <= 20; line += 1) {
    const position = 1 + line * 0.05;
    const major = line % 4 === 0;
    worldLine(context, toScreen, position, 1, position, 2, major ? "#53616a" : "#8d999e", (major ? 0.008 : 0.0028) * pixelsPerUnit);
    worldLine(context, toScreen, 1, position, 2, position, major ? "#53616a" : "#8d999e", (major ? 0.008 : 0.0028) * pixelsPerUnit);
  }

  const region = REGIONS[activeRegion];
  const left = 1 + region.column * 0.2;
  const top = 1 + region.row * 0.2;
  context.save();
  const start = toScreen(left, top);
  const end = toScreen(left + 0.2, top + 0.2);
  context.strokeStyle = "rgba(201, 70, 91, .72)";
  context.lineWidth = Math.max(1, pixelsPerUnit * 0.006);
  context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  context.restore();

  const center = toScreen(1.5, 1.5);
  context.save();
  context.fillStyle = "rgba(92, 107, 119, .1)";
  context.font = `600 ${Math.max(16, pixelsPerUnit * 0.15)}px Halenoir, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("RBC AREA", center.x, center.y);
  context.restore();
}

function drawCornerExtensions(
  context: CanvasRenderingContext2D,
  toScreen: (x: number, y: number) => { x: number; y: number },
  pixelsPerUnit: number,
) {
  const corners = [
    { x: 0, y: 0, vx1: 0, vx2: 2, hy1: 0, hy2: 2 },
    { x: 2, y: 0, vx1: 0, vx2: 2, hy1: 1, hy2: 3 },
    { x: 0, y: 2, vx1: 1, vx2: 3, hy1: 0, hy2: 2 },
    { x: 2, y: 2, vx1: 1, vx2: 3, hy1: 1, hy2: 3 },
  ];
  for (const corner of corners) {
    for (let sub = 1; sub < 4; sub += 1) {
      worldLine(context, toScreen, corner.x + sub / 4, corner.vx1, corner.x + sub / 4, corner.vx2, "#849098", Math.max(0.7, pixelsPerUnit * 0.004));
      worldLine(context, toScreen, corner.hy1, corner.y + sub / 4, corner.hy2, corner.y + sub / 4, "#849098", Math.max(0.7, pixelsPerUnit * 0.004));
    }
  }
}

function worldLine(
  context: CanvasRenderingContext2D,
  toScreen: (x: number, y: number) => { x: number; y: number },
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
) {
  const start = toScreen(x1, y1);
  const end = toScreen(x2, y2);
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = color;
  context.lineWidth = Math.max(0.6, width);
  context.stroke();
}

function drawErythrocyte(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  counted: boolean,
) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.scale(1, 0.9);
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fillStyle = counted ? "#d5eee7" : "rgba(210, 74, 86, .72)";
  context.fill();

  if (radius >= 2) {
    context.beginPath();
    context.arc(0, 0, radius * 0.46, 0, Math.PI * 2);
    context.fillStyle = counted ? "rgba(8, 127, 120, .25)" : "rgba(250, 191, 184, .8)";
    context.fill();
    context.strokeStyle = counted ? "#087f78" : "rgba(150, 45, 58, .5)";
    context.lineWidth = Math.max(0.5, radius * 0.1);
    context.stroke();
  }

  if (counted) {
    context.beginPath();
    context.arc(0, 0, Math.max(2.5, radius * 1.55), 0, Math.PI * 2);
    context.strokeStyle = "#087f78";
    context.lineWidth = Math.max(1, radius * 0.16);
    context.stroke();
  }
  context.restore();
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
