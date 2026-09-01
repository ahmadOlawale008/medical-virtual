"use client";

import { useEffect, useRef } from "react";
import type { DkaModel, DkaResults } from "./model";

type Props = {
  model: DkaModel;
  results: DkaResults;
  running: boolean;
};

export default function MetabolicCanvas({ model, results, running }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const wrapper = canvas?.parentElement;
    if (!canvas || !context || !wrapper) return;

    let animationFrame = 0;
    let previousTime = performance.now();

    const resize = () => {
      const bounds = wrapper.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.max(1, Math.floor(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(bounds.height * pixelRatio));
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    resize();

    const render = (timestamp: number) => {
      const elapsed = Math.min(timestamp - previousTime, 50);
      previousTime = timestamp;
      if (running) timeRef.current += elapsed / 1000;

      drawMetabolism(
        context,
        canvas.clientWidth,
        canvas.clientHeight,
        timeRef.current,
        model,
        results,
      );
      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [model, results, running]);

  return (
    <canvas
      ref={canvasRef}
      className="block size-full"
      aria-label="Animated metabolic pathway showing impaired glucose uptake, lipolysis, hepatic ketone production, acidosis, and renal water loss"
    />
  );
}

function drawMetabolism(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  model: DkaModel,
  results: DkaResults,
) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#f5f2ef";
  context.fillRect(0, 0, width, height);

  const scaleX = width / 760;
  const scaleY = height / 500;
  context.save();
  context.scale(scaleX, scaleY);

  drawBloodstream(context, time, results);
  drawMuscleCell(context, time, results);
  drawAdipose(context, time, results);
  drawLiver(context, time, results);
  drawKidney(context, time, model, results);

  context.restore();
}

function drawBloodstream(
  context: CanvasRenderingContext2D,
  time: number,
  results: DkaResults,
) {
  roundedRect(context, 28, 28, 704, 92, 26, "#f8d9d5", "#bd625d");
  label(context, "BLOODSTREAM", 48, 52, "#8f3b39", 11);
  label(context, `${results.glucose.toFixed(0)} mg/dL glucose`, 48, 101, "#6a2828", 14, true);

  const glucoseCount = Math.round(7 + results.glucose / 36);
  for (let index = 0; index < glucoseCount; index += 1) {
    const x = 215 + ((index * 47 + time * 35) % 490);
    const y = 57 + (index % 3) * 18;
    drawHexagon(context, x, y, 6, "#f2b642", "#8d5b12");
  }

  const ketoneCount = Math.round(results.ketones * 1.6);
  for (let index = 0; index < ketoneCount; index += 1) {
    const x = 300 + ((index * 61 + time * 48) % 390);
    const y = 64 + (index % 2) * 24;
    drawKetone(context, x, y);
  }
}

function drawMuscleCell(
  context: CanvasRenderingContext2D,
  time: number,
  results: DkaResults,
) {
  roundedRect(context, 40, 170, 205, 135, 58, "#dcebe5", "#3c7b6f", 2);
  label(context, "SKELETAL MUSCLE", 68, 199, "#24695f", 11);
  label(context, "Glucose uptake", 68, 226, "#183f3a", 13, true);
  label(context, `${results.cellularUptake.toFixed(0)}%`, 68, 255, "#183f3a", 22, true);

  context.fillStyle = results.cellularUptake < 40 ? "#d9793a" : "#148b7e";
  context.fillRect(226, 207, 8, 54);
  label(context, "GLUT", 202, 278, "#45635e", 9);

  const entryCount = Math.max(1, Math.round(results.cellularUptake / 20));
  for (let index = 0; index < entryCount; index += 1) {
    const progress = (time * 0.3 + index / entryCount) % 1;
    drawHexagon(context, 285 - progress * 100, 235, 5, "#f2b642", "#8d5b12");
  }

  arrow(context, 310, 235, 245, 235, results.cellularUptake < 40 ? "#d9793a" : "#148b7e", 2);
}

function drawAdipose(
  context: CanvasRenderingContext2D,
  time: number,
  results: DkaResults,
) {
  roundedRect(context, 40, 350, 190, 112, 18, "#fff0c9", "#c79735", 2);
  label(context, "ADIPOSE TISSUE", 62, 377, "#7b5718", 11);
  label(context, "Lipolysis", 62, 408, "#4b3614", 13, true);
  label(context, `${results.lipolysis.toFixed(0)}%`, 62, 439, "#4b3614", 22, true);

  const particleCount = Math.max(1, Math.round(results.lipolysis / 14));
  for (let index = 0; index < particleCount; index += 1) {
    const progress = (time * 0.18 + index / particleCount) % 1;
    const x = 230 + progress * 100;
    const y = 398 - Math.sin(progress * Math.PI) * 18;
    context.beginPath();
    context.arc(x, y, 4.5, 0, Math.PI * 2);
    context.fillStyle = "#e5a72f";
    context.fill();
  }
  arrow(context, 232, 407, 332, 407, "#c79735", 2);
  label(context, "free fatty acids", 240, 438, "#75531c", 9);
}

function drawLiver(
  context: CanvasRenderingContext2D,
  time: number,
  results: DkaResults,
) {
  roundedRect(context, 334, 336, 190, 126, 34, "#e9d2c5", "#9e5844", 2);
  label(context, "LIVER", 360, 366, "#7c3f30", 11);
  label(context, "Ketogenesis", 360, 397, "#4d2a23", 13, true);
  label(context, `${results.ketogenesis.toFixed(0)}%`, 360, 429, "#4d2a23", 22, true);

  const ketoneCount = Math.max(1, Math.round(results.ketogenesis / 13));
  for (let index = 0; index < ketoneCount; index += 1) {
    const progress = (time * 0.22 + index / ketoneCount) % 1;
    const x = 520 + progress * 75;
    const y = 390 - progress * 155;
    drawKetone(context, x, y);
  }
  arrow(context, 525, 382, 596, 226, "#c74b3e", 2.5);
  label(context, "ketone acids", 538, 338, "#97392f", 9);
}

function drawKidney(
  context: CanvasRenderingContext2D,
  time: number,
  model: DkaModel,
  results: DkaResults,
) {
  roundedRect(context, 585, 170, 145, 292, 20, "#e5edf0", "#567680", 2);
  label(context, "KIDNEY", 608, 198, "#3c6872", 11);
  label(context, "Osmotic diuresis", 608, 225, "#28484e", 12, true);
  label(context, `${results.osmoticDiuresis.toFixed(0)}%`, 608, 253, "#28484e", 20, true);

  context.beginPath();
  context.moveTo(632, 285);
  context.bezierCurveTo(593, 272, 597, 350, 637, 352);
  context.bezierCurveTo(669, 346, 666, 298, 632, 285);
  context.fillStyle = "#b85d63";
  context.fill();
  context.strokeStyle = "#77383d";
  context.lineWidth = 2;
  context.stroke();

  const dropCount = Math.max(1, Math.round((results.osmoticDiuresis + model.dehydration) / 22));
  for (let index = 0; index < dropCount; index += 1) {
    const progress = (time * 0.32 + index / dropCount) % 1;
    drawDrop(context, 625 + (index % 3) * 16, 355 + progress * 78);
  }
  arrow(context, 647, 353, 647, 440, "#438da7", 2);
  label(context, "H₂O + glucose + ketones", 596, 454, "#3c6872", 9);
}

function drawKetone(context: CanvasRenderingContext2D, x: number, y: number) {
  context.save();
  context.translate(x, y);
  context.rotate(Math.PI / 4);
  context.fillStyle = "#cf493d";
  context.strokeStyle = "#7d241f";
  context.lineWidth = 1.2;
  context.fillRect(-4.5, -4.5, 9, 9);
  context.strokeRect(-4.5, -4.5, 9, 9);
  context.restore();
}

function drawDrop(context: CanvasRenderingContext2D, x: number, y: number) {
  context.beginPath();
  context.moveTo(x, y - 7);
  context.bezierCurveTo(x - 8, y + 2, x - 5, y + 8, x, y + 8);
  context.bezierCurveTo(x + 5, y + 8, x + 8, y + 2, x, y - 7);
  context.fillStyle = "#62b9d1";
  context.fill();
}

function drawHexagon(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  stroke: string,
) {
  context.beginPath();
  for (let index = 0; index < 6; index += 1) {
    const angle = Math.PI / 3 * index;
    const pointX = x + Math.cos(angle) * radius;
    const pointY = y + Math.sin(angle) * radius;
    if (index === 0) context.moveTo(pointX, pointY);
    else context.lineTo(pointX, pointY);
  }
  context.closePath();
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 1.2;
  context.fill();
  context.stroke();
}

function arrow(
  context: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  width: number,
) {
  const angle = Math.atan2(endY - startY, endX - startX);
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.setLineDash([6, 5]);
  context.stroke();
  context.setLineDash([]);
  context.beginPath();
  context.moveTo(endX, endY);
  context.lineTo(endX - 9 * Math.cos(angle - Math.PI / 6), endY - 9 * Math.sin(angle - Math.PI / 6));
  context.lineTo(endX - 9 * Math.cos(angle + Math.PI / 6), endY - 9 * Math.sin(angle + Math.PI / 6));
  context.closePath();
  context.fillStyle = color;
  context.fill();
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  stroke: string,
  lineWidth = 1.5,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = lineWidth;
  context.fill();
  context.stroke();
}

function label(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  size: number,
  bold = false,
) {
  context.fillStyle = color;
  context.font = `${bold ? 700 : 600} ${size}px "Halenoir", sans-serif`;
  context.fillText(text, x, y);
}
