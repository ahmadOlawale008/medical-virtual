import type { TwitchTrace } from "../simple-muscle-twitch/twitch-model";

export const STRENGTH_MAX_RESPONSE = 60;
export const STRENGTH_WINDOW_MS = 700;
export const STRENGTH_PLAYBACK_MS = 700;

export type InductionPhase = "make" | "break";

export type StimulusStrengthRecording = TwitchTrace & {
  distance: number;
  makeForce: number;
  breakForce: number;
  positionIndex: number;
};

export const strengthPresets = [
  { label: "Sub-threshold", distance: 15 },
  { label: "Threshold", distance: 14 },
  { label: "Sub-maximal", distance: 9 },
  { label: "Maximal", distance: 5 },
  { label: "Supra-maximal", distance: 0 },
] as const;

export function distanceToVoltage(distance: number) {
  return Math.max(0, (15 - distance) * 0.33);
}

export function calculateInductionResponse(
  distance: number,
  phase: InductionPhase,
) {
  const thresholdDistance = phase === "make" ? 12 : 14;

  if (distance > thresholdDistance) return 0;
  if (distance <= 5) return STRENGTH_MAX_RESPONSE;

  const recruitment =
    (thresholdDistance - distance) / (thresholdDistance - 5);
  const eased = recruitment < 0.5
    ? 2 * recruitment * recruitment
    : 1 - Math.pow(-2 * recruitment + 2, 2) / 2;

  return 5 + (STRENGTH_MAX_RESPONSE - 5) * eased;
}

export function createStimulusStrengthRecording(
  id: number,
  distance: number,
): StimulusStrengthRecording {
  const makeForce = calculateInductionResponse(distance, "make");
  const breakForce = calculateInductionResponse(distance, "break");
  const samples = Array.from(
    { length: STRENGTH_WINDOW_MS / 5 + 1 },
    (_, index) => {
      const time = index * 5;
      return {
        time,
        force:
          pulseAt(time, 0, makeForce) + pulseAt(time, 500, breakForce),
      };
    },
  );

  return {
    id,
    voltage: distanceToVoltage(distance),
    mode: "indirect",
    peakForce: Math.max(makeForce, breakForce),
    latency: 0,
    contraction: 100,
    relaxation: 100,
    samples,
    distance,
    makeForce,
    breakForce,
    positionIndex: id - 1,
  };
}

function pulseAt(time: number, start: number, amplitude: number) {
  if (time < start || time > start + 200 || amplitude === 0) return 0;
  return amplitude * Math.sin(((time - start) / 200) * Math.PI);
}
