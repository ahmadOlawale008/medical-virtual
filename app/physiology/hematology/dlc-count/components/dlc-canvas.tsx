"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ERYTHROCYTES,
  LEUKOCYTES,
  OBJECTIVE_ZOOM,
  type CellType,
  type Objective,
} from "../model";

const VIEW_SIZE = 760;
const VIEW_RADIUS = 342;
const WORLD_UNIT = 190;

export default function DlcCanvas({
  objective,
  stage,
  selectedCell,
  classifiedCells,
  onPan,
  onSelectCell,
}: {
  objective: Objective;
  stage: { x: number; y: number };
  selectedCell: string | null;
  classifiedCells: Set<string>;
  onPan: (deltaX: number, deltaY: number) => void;
  onSelectCell: (id: string, type: CellType) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
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
      x: 380 + (x - centerX) * pixelsPerUnit,
      y: 380 + (y - centerY) * pixelsPerUnit,
    });

    context.clearRect(0, 0, VIEW_SIZE, VIEW_SIZE);
    context.save();
    context.beginPath();
    context.arc(380, 380, VIEW_RADIUS, 0, Math.PI * 2);
    context.clip();

    const smear = context.createRadialGradient(355, 340, 20, 380, 380, 365);
    smear.addColorStop(0, "#fff5f5");
    smear.addColorStop(0.65, "#f9e8eb");
    smear.addColorStop(1, "#d9c8cc");
    context.fillStyle = smear;
    context.fillRect(0, 0, VIEW_SIZE, VIEW_SIZE);

    const lowPowerVisibility = objective === 4 ? 0.18 : objective === 10 ? 0.48 : 1;
    for (const cell of ERYTHROCYTES) {
      const point = toScreen(cell.x, cell.y);
      const radius = Math.max(0.18, cell.radius * pixelsPerUnit * lowPowerVisibility);
      if (Math.hypot(point.x - 380, point.y - 380) > VIEW_RADIUS + radius) continue;
      drawRedCell(context, point.x, point.y, radius, cell.rotation);
    }

    for (const cell of LEUKOCYTES) {
      const point = toScreen(cell.x, cell.y);
      const radius = Math.max(0.3, cell.radius * pixelsPerUnit * lowPowerVisibility);
      if (Math.hypot(point.x - 380, point.y - 380) > VIEW_RADIUS + radius) continue;
      drawWhiteCell(
        context,
        cell.type,
        point.x,
        point.y,
        radius,
        cell.rotation,
        selectedCell === cell.id,
        classifiedCells.has(cell.id),
      );
    }

    context.restore();
    drawEyepiece(context);
  }, [classifiedCells, getTransform, objective, selectedCell]);

  function selectAtPointer(event: React.PointerEvent<HTMLCanvasElement>) {
    if (objective < 40) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * VIEW_SIZE;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * VIEW_SIZE;
    const { centerX, centerY, pixelsPerUnit } = getTransform();
    const worldX = centerX + (pointerX - 380) / pixelsPerUnit;
    const worldY = centerY + (pointerY - 380) / pixelsPerUnit;
    const closest = LEUKOCYTES
      .filter((cell) => !classifiedCells.has(cell.id))
      .map((cell) => ({ cell, distance: Math.hypot(cell.x - worldX, cell.y - worldY) }))
      .filter(({ cell, distance }) => distance <= Math.max(cell.radius * 1.8, 8 / pixelsPerUnit))
      .sort((a, b) => a.distance - b.distance)[0];
    if (closest) onSelectCell(closest.cell.id, closest.cell.type);
  }

  function pointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
    };
    setDragging(true);
  }

  function pointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas || drag.pointerId !== event.pointerId) return;
    const bounds = canvas.getBoundingClientRect();
    const factor = VIEW_SIZE / bounds.width;
    const { pixelsPerUnit } = getTransform();
    onPan(
      -((event.clientX - drag.lastX) * factor) / pixelsPerUnit,
      -((event.clientY - drag.lastY) * factor) / pixelsPerUnit,
    );
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
  }

  function pointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) {
      selectAtPointer(event);
    }
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
      aria-label={`Interactive peripheral blood smear at ${objective} times magnification.`}
    />
  );
}

function drawRedCell(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.scale(1, 0.88);
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fillStyle = "rgba(224, 104, 112, .46)";
  context.fill();
  if (radius >= 1.8) {
    context.beginPath();
    context.arc(0, 0, radius * 0.48, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 211, 207, .82)";
    context.fill();
  }
  context.restore();
}

function drawWhiteCell(
  context: CanvasRenderingContext2D,
  type: CellType,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  selected: boolean,
  classified: boolean,
) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fillStyle = type === "Monocyte" ? "rgba(187, 211, 224, .92)" : "rgba(248, 226, 239, .94)";
  context.fill();
  context.strokeStyle = "rgba(159, 99, 145, .38)";
  context.lineWidth = Math.max(0.4, radius * 0.08);
  context.stroke();

  if (radius >= 2.5) {
    drawNucleus(context, type, radius);
  } else {
    context.beginPath();
    context.arc(0, 0, Math.max(0.32, radius * 0.72), 0, Math.PI * 2);
    context.fillStyle = type === "Basophil" ? "#38235d" : "#654080";
    context.fill();
  }
  if (selected || classified) {
    context.beginPath();
    context.arc(0, 0, radius * 1.35, 0, Math.PI * 2);
    context.strokeStyle = classified ? "#087f78" : "#d8783d";
    context.lineWidth = Math.max(1, radius * 0.12);
    context.stroke();
  }
  context.restore();
}

function drawNucleus(context: CanvasRenderingContext2D, type: CellType, radius: number) {
  const purple = "#5b3978";
  if (type === "Neutrophil") {
    for (const [x, y] of [[-0.4, -0.12], [0.05, 0.24], [0.42, -0.18]]) {
      context.beginPath();
      context.ellipse(x * radius, y * radius, radius * 0.28, radius * 0.22, 0, 0, Math.PI * 2);
      context.fillStyle = purple;
      context.fill();
    }
    addGranules(context, radius, "rgba(168, 123, 157, .45)", 12);
  } else if (type === "Lymphocyte") {
    context.beginPath();
    context.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
    context.fillStyle = "#463064";
    context.fill();
  } else if (type === "Monocyte") {
    context.beginPath();
    context.arc(0, 0, radius * 0.62, 0.32, Math.PI * 1.72);
    context.arc(radius * 0.2, 0, radius * 0.32, Math.PI * 1.55, Math.PI * 0.45, true);
    context.closePath();
    context.fillStyle = "#65457c";
    context.fill();
  } else if (type === "Eosinophil") {
    for (const x of [-0.3, 0.3]) {
      context.beginPath();
      context.ellipse(x * radius, 0, radius * 0.3, radius * 0.38, 0, 0, Math.PI * 2);
      context.fillStyle = purple;
      context.fill();
    }
    addGranules(context, radius, "rgba(222, 91, 58, .82)", 18);
  } else {
    context.beginPath();
    context.ellipse(0, 0, radius * 0.55, radius * 0.42, 0, 0, Math.PI * 2);
    context.fillStyle = "rgba(55, 38, 89, .72)";
    context.fill();
    addGranules(context, radius, "rgba(61, 36, 100, .9)", 24);
  }
}

function addGranules(
  context: CanvasRenderingContext2D,
  radius: number,
  color: string,
  amount: number,
) {
  context.fillStyle = color;
  for (let index = 0; index < amount; index += 1) {
    const angle = index * 2.399;
    const distance = radius * (0.18 + ((index * 37) % 68) / 100);
    context.beginPath();
    context.arc(
      Math.cos(angle) * distance,
      Math.sin(angle) * distance,
      Math.max(0.45, radius * 0.055),
      0,
      Math.PI * 2,
    );
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
