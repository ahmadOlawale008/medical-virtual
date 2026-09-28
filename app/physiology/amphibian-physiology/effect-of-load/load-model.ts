import type { TwitchTrace } from "../simple-muscle-twitch/twitch-model";

export const LOAD_WINDOW_MS = 420;
export const LOAD_PLAYBACK_MS = 1750;
export const LOAD_AXIS_MAX = 8;

export type LoadMode = "afterloaded" | "freeloaded";

export type LoadRecording = TwitchTrace & {
  load: number;
  loadMode: LoadMode;
  shortening: number;
  work: number;
  color: string;
};

export function calculateShortening(load: number, mode: LoadMode) {
  const normalizedLoad = Math.min(1, load / 100);
  const base = mode === "afterloaded" ? 7.2 : 7.7;
  const resistance = mode === "afterloaded" ? 0.56 : 0.38;
  return Math.max(2.8, base * (1 - normalizedLoad * resistance));
}

export function calculateWork(load: number, shortening: number) {
  return (load * shortening) / 100;
}

export function createLoadRecording(
  id: number,
  load: number,
  loadMode: LoadMode,
): LoadRecording {
  const shortening = calculateShortening(load, loadMode);
  const latency = loadMode === "afterloaded" ? 24 : 16;
  const contraction = 105 + Math.round(load * 0.45);
  const relaxation = 120 + Math.round(load * 0.35);
  const samples = Array.from({ length: LOAD_WINDOW_MS + 1 }, (_, time) => {
    if (time < latency) return { time, force: 0 };
    const active = time - latency;
    if (active <= contraction) {
      return {
        time,
        force: shortening * (0.5 - Math.cos((active / contraction) * Math.PI) / 2),
      };
    }
    if (active <= contraction + relaxation) {
      const progress = (active - contraction) / relaxation;
      return { time, force: shortening * (1 + Math.cos(progress * Math.PI)) / 2 };
    }
    return { time, force: 0 };
  });

  return {
    id,
    load,
    loadMode,
    shortening,
    work: calculateWork(load, shortening),
    color: loadMode === "afterloaded" ? "#43df94" : "#5d8dff",
    samples,
    voltage: 4,
    mode: "indirect",
    peakForce: shortening,
    latency,
    contraction,
    relaxation,
  };
}

export function loadModeLabel(mode: LoadMode) {
  return mode === "afterloaded" ? "After-loaded" : "Free-loaded";
}
